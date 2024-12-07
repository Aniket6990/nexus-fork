// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { ECDSA } from "solady/utils/ECDSA.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { PackedUserOperation } from "account-abstraction/interfaces/PackedUserOperation.sol";
import "../../interfaces/base/IExecutionHelper.sol";
import { MODULE_TYPE_VALIDATOR, VALIDATION_FAILED, VALIDATION_SUCCESS } from "../../types/Constants.sol";
import "account-abstraction/core/Helpers.sol";
import "../../lib/ModeLib.sol";
import "../../lib/ExecLib.sol";
import { IRebalancingValidator } from "../../interfaces/modules/IRebalancingValidator.sol";
import { ArrayLib } from "../../lib/ArrayLib.sol";

contract DelegatorValidator is IRebalancingValidator {
    using ModeLib for ModeCode;
    using ExecLib for bytes;

    string constant NAME = "Rebalancing validator";
    string constant VERSION = "1.0.0";

    error RebalancingSKV_ModuleAlreadyInstalled();
    error RebalancingSKV_ModuleNotInstalled();
    error RebalancingSKV_InvalidSessionKey();
    error RebalancingSKV_InvalidExecutor();
    error RebalancingSKV_InvalidFunctionSelector();
    error RebalancingSKV_InvalidValidAfter();
    error RebalancingSKV_InvalidValidUntil();
    error RebalancingSKV_SessionKeyAlreadyExists(address sessionKey);
    error RebalancingSKV_SessionKeyDoesNotExist(address session);
    error NotImplemented();

    mapping(address => bool) public initialized;
    mapping(address wallet => address[] assocSessionKeys) public walletSessionKeys;
    mapping(address sessionKey => mapping(address wallet => SessionData)) public sessionData;

    function enableSessionKey(bytes calldata _sessionData) public {
        address sessionKey = address(bytes20(_sessionData[0:20]));
        if (sessionKey == address(0)) {
            revert RebalancingSKV_InvalidSessionKey();
        }
        if (sessionData[sessionKey][msg.sender].validUntil > block.timestamp && ArrayLib._contains(getAssociatedSessionKeys(), sessionKey)) {
            revert RebalancingSKV_SessionKeyAlreadyExists(sessionKey);
        }
        address executor = address(bytes20(_sessionData[20:40]));
        if (executor == address(0)) {
            revert RebalancingSKV_InvalidExecutor();
        }
        bytes4 funcSelector = bytes4(_sessionData[40:44]);
        if (funcSelector == bytes4(0)) {
            revert RebalancingSKV_InvalidFunctionSelector();
        }
        uint48 validAfter = uint48(bytes6(_sessionData[44:50]));
        if (validAfter == 0) {
            revert RebalancingSKV_InvalidValidAfter();
        }
        uint48 validUntil = uint48(bytes6(_sessionData[50:56]));
        if (validUntil == 0) {
            revert RebalancingSKV_InvalidValidUntil();
        }
        sessionData[sessionKey][msg.sender] = SessionData(executor, funcSelector, validAfter, validUntil, true);
        walletSessionKeys[msg.sender].push(sessionKey);
        emit RebalancingSKV_SessionKeyEnabled(sessionKey, msg.sender);
    }

    function disableSessionKey(address _session) public {
        if (sessionData[_session][msg.sender].validUntil == 0) revert RebalancingSKV_SessionKeyDoesNotExist(_session);
        delete sessionData[_session][msg.sender];
        walletSessionKeys[msg.sender] = ArrayLib._removeElement(getAssociatedSessionKeys(), _session);
        emit RebalancingSKV_SessionKeyDisabled(_session, msg.sender);
    }

    function toggleSessionKeyPause(address _sessionKey) external {
        SessionData storage sd = sessionData[_sessionKey][msg.sender];
        if (sd.validUntil == 0) {
            revert RebalancingSKV_SessionKeyDoesNotExist(_sessionKey);
        }
        if (sd.live) {
            sd.live = false;
            emit RebalancingSKV_SessionKeyPaused(_sessionKey, msg.sender);
        } else {
            sd.live = true;
            emit RebalancingSKV_SessionKeyUnpaused(_sessionKey, msg.sender);
        }
    }

    function isSessionKeyLive(address _sessionKey) public view returns (bool) {
        return sessionData[_sessionKey][msg.sender].live;
    }

    function validateSessionKeyParams(address _sessionKey, PackedUserOperation calldata userOp) public view returns (bool) {
        SessionData memory sd = sessionData[_sessionKey][msg.sender];
        if (isSessionKeyLive(_sessionKey) == false) {
            return false;
        }
        address target;
        bytes calldata callData = userOp.callData;
        bytes4 sel = bytes4(callData[:4]);
        ModeCode mode = ModeCode.wrap(bytes32(callData[4:36]));
        (CallType calltype, , , ) = ModeLib.decode(mode);
        if (calltype == CALLTYPE_SINGLE) {
            bytes calldata execData;
            // 0x00 ~ 0x04 : selector
            // 0x04 ~ 0x24 : mode code
            // 0x24 ~ 0x44 : execution target
            // 0x44 ~0x64 : execution value
            // 0x64 ~ : execution calldata
            (target, , execData) = ExecLib.decodeSingle(callData[100:]);
            bytes4 selector = _digest(execData);
            if (target != sd.executor) return false;
            if (selector != sd.funcSelector) return false;
            return true;
        } else {
            return false;
        }
    }

    function getAssociatedSessionKeys() public view returns (address[] memory) {
        return walletSessionKeys[msg.sender];
    }

    function getSessionKeyData(address _sessionKey) public view returns (SessionData memory) {
        return sessionData[_sessionKey][msg.sender];
    }

    function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) external override returns (uint256) {
        address sessionKeySigner = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);
        if (!validateSessionKeyParams(sessionKeySigner, userOp)) return VALIDATION_FAILED;
        SessionData memory sd = sessionData[sessionKeySigner][msg.sender];
        return _packValidationData(false, sd.validUntil, sd.validAfter);
    }

    function isModuleType(uint256 moduleTypeId) external pure override returns (bool) {
        return moduleTypeId == MODULE_TYPE_VALIDATOR;
    }

    function onInstall(bytes calldata data) external override {
        if (initialized[msg.sender] == true) revert RebalancingSKV_ModuleAlreadyInstalled();
        initialized[msg.sender] = true;
        emit RebalancingSKV_ModuleInstalled(msg.sender);
    }

    function onUninstall(bytes calldata data) external override {
        if (initialized[msg.sender] == false) revert RebalancingSKV_ModuleNotInstalled();
        address[] memory sessionKeys = getAssociatedSessionKeys();
        uint256 sessionKeysLength = sessionKeys.length;
        for (uint256 i; i < sessionKeysLength; i++) {
            delete sessionData[sessionKeys[i]][msg.sender];
        }
        delete walletSessionKeys[msg.sender];
        initialized[msg.sender] = false;
        emit RebalancingSKV_ModuleUninstalled(msg.sender);
    }

    function isValidSignatureWithSender(address sender, bytes32 hash, bytes calldata data) external view returns (bytes4) {
        revert NotImplemented();
    }

    function isInitialized(address smartAccount) external view returns (bool) {
        return initialized[smartAccount];
    }

    function _digest(bytes calldata _data) internal pure returns (bytes4 selector) {
        selector = bytes4(_data[0:4]);
    }
}
