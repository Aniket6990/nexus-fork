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
import { IERC20DelegatorValidator } from "../../interfaces/modules/IERC20DelegatorValidator.sol";
import { ArrayLib } from "../../lib/ArrayLib.sol";

contract DelegatorValidator is IERC20DelegatorValidator {
    using ModeLib for ExecutionMode;
    using ExecLib for bytes;


    string constant NAME = "DelegatorValidator";
    string constant VERSION = "1.0.0";


    error ERC20SKV_ModuleAlreadyInstalled();
    error ERC20SKV_ModuleNotInstalled();
    error ERC20SKV_InvalidSessionKey();
    error ERC20SKV_InvalidToken();
    error ERC20SKV_InvalidFunctionSelector();
    error ERC20SKV_InvalidSpendingLimit();
    error ERC20SKV_InvalidValidAfter();
    error ERC20SKV_InvalidValidUntil();
    error ERC20SKV_SessionKeyAlreadyExists(address sessionKey);
    error ERC20SKV_SessionKeyDoesNotExist(address session);
    error NotImplemented();



    mapping(address => bool) public initialized;
    mapping(address wallet => address[] assocSessionKeys) public walletSessionKeys;
    mapping(address sessionKey => mapping(address wallet => SessionData)) public sessionData;


    function enableSessionKey(bytes calldata _sessionData) public {
        address sessionKey = address(bytes20(_sessionData[0:20]));
        if (sessionKey == address(0)) {
            revert ERC20SKV_InvalidSessionKey();
        }
        if (
            sessionData[sessionKey][msg.sender].validUntil > block.timestamp &&
            ArrayLib._contains(getAssociatedSessionKeys(), sessionKey)
        ) {
            revert ERC20SKV_SessionKeyAlreadyExists(sessionKey);
        }
        address token = address(bytes20(_sessionData[20:40]));
        if (token == address(0)) {
            revert ERC20SKV_InvalidToken();
        }
        bytes4 funcSelector = bytes4(_sessionData[40:44]);
        if (funcSelector == bytes4(0)) {
            revert ERC20SKV_InvalidFunctionSelector();
        }
        uint256 spendingLimit = uint256(bytes32(_sessionData[44:76]));
        if (spendingLimit == 0) {
            revert ERC20SKV_InvalidSpendingLimit();
        }
        uint48 validAfter = uint48(bytes6(_sessionData[76:82]));
        if (validAfter == 0) {
            revert ERC20SKV_InvalidValidAfter();
        }
        uint48 validUntil = uint48(bytes6(_sessionData[82:88]));
        if (validUntil == 0) {
            revert ERC20SKV_InvalidValidUntil();
        }
        sessionData[sessionKey][msg.sender] = SessionData(token, funcSelector, spendingLimit, validAfter, validUntil, true);
        walletSessionKeys[msg.sender].push(sessionKey);
        emit ERC20SKV_SessionKeyEnabled(sessionKey, msg.sender);
    }

    function disableSessionKey(address _session) public {
        if (sessionData[_session][msg.sender].validUntil == 0) revert ERC20SKV_SessionKeyDoesNotExist(_session);
        delete sessionData[_session][msg.sender];
        walletSessionKeys[msg.sender] = ArrayLib._removeElement(getAssociatedSessionKeys(), _session);
        emit ERC20SKV_SessionKeyDisabled(_session, msg.sender);
    }

    function toggleSessionKeyPause(address _sessionKey) external {
        SessionData storage sd = sessionData[_sessionKey][msg.sender];
        if (sd.validUntil == 0){
            revert ERC20SKV_SessionKeyDoesNotExist(_sessionKey);
        }
        if (sd.live) {
            sd.live = false;
            emit ERC20SKV_SessionKeyPaused(_sessionKey, msg.sender);
        } else {
            sd.live = true;
            emit ERC20SKV_SessionKeyUnpaused(_sessionKey, msg.sender);
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
        ExecutionMode mode = ExecutionMode.wrap(bytes32(callData[4:36]));
        (CallType calltype, , , ) = ModeLib.decode(mode);
        if (calltype == CALLTYPE_SINGLE) {
            bytes calldata execData;
            // 0x00 ~ 0x04 : selector
            // 0x04 ~ 0x24 : mode code
            // 0x24 ~ 0x44 : execution target
            // 0x44 ~0x64 : execution value
            // 0x64 ~ : execution calldata
            (target, , execData) = ExecLib.decodeSingle(callData[100:]);
            (bytes4 selector, address from, address to, uint256 amount) = _digest(execData);
            if (target != sd.token) return false;
            if (selector != sd.funcSelector) return false;
            if (amount > sd.spendingLimit) return false;
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
        if (initialized[msg.sender] == true) revert ERC20SKV_ModuleAlreadyInstalled();
        initialized[msg.sender] = true;
        emit ERC20SKV_ModuleInstalled(msg.sender);
    }

    function onUninstall(bytes calldata data) external override {
        if (initialized[msg.sender] == false) revert ERC20SKV_ModuleNotInstalled();
        address[] memory sessionKeys = getAssociatedSessionKeys();
        uint256 sessionKeysLength = sessionKeys.length;
        for (uint256 i; i < sessionKeysLength; i++) {
            delete sessionData[sessionKeys[i]][msg.sender];
        }
        delete walletSessionKeys[msg.sender];
        initialized[msg.sender] = false;
        emit ERC20SKV_ModuleUninstalled(msg.sender);
    }

    function isValidSignatureWithSender(address sender, bytes32 hash, bytes calldata data) external view returns (bytes4) {
        revert NotImplemented();
    }

    function isInitialized(address smartAccount) external view returns (bool) {
        return initialized[smartAccount];
    }



    function _digest(bytes calldata _data) internal pure returns (bytes4 selector, address from, address to, uint256 amount) {
        selector = bytes4(_data[0:4]);
        if (selector == IERC20.approve.selector || selector == IERC20.transfer.selector) {
            to = address(bytes20(_data[16:36]));
            amount = uint256(bytes32(_data[36:68]));
            return (selector, address(0), to, amount);
        } else if (selector == IERC20.transferFrom.selector) {
            from = address(bytes20(_data[16:36]));
            to = address(bytes20(_data[48:68]));
            amount = uint256(bytes32(_data[68:100]));
            return (selector, from, to, amount);
        } else {
            return (bytes4(0), address(0), address(0), 0);
        }
    }
}