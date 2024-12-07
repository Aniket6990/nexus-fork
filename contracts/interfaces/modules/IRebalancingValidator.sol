// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { IValidator } from "./IValidator.sol";
import { IERC7579Account } from "../IERC7579Account.sol";
import { PackedUserOperation } from "account-abstraction/interfaces/PackedUserOperation.sol";

interface IRebalancingValidator is IValidator {
    event RebalancingSKV_ModuleInstalled(address wallet);

    event RebalancingSKV_ModuleUninstalled(address wallet);

    event RebalancingSKV_SessionKeyEnabled(address sessionKey, address wallet);

    event RebalancingSKV_SessionKeyDisabled(address sessionKey, address wallet);

    event RebalancingSKV_SessionKeyPaused(address sessionKey, address wallet);

    event RebalancingSKV_SessionKeyUnpaused(address sessionKey, address wallet);

    struct SessionData {
        address executor;
        bytes4 funcSelector;
        uint48 validAfter;
        uint48 validUntil;
        bool live;
    }

    function enableSessionKey(bytes calldata _sessionData) external;

    function disableSessionKey(address _session) external;

    function isSessionKeyLive(address _sessionKey) external view returns (bool paused);

    function validateSessionKeyParams(address _sessionKey, PackedUserOperation calldata userOp) external returns (bool);

    function getAssociatedSessionKeys() external view returns (address[] memory keys);

    function getSessionKeyData(address _sessionKey) external view returns (SessionData memory data);

    function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) external returns (uint256 validationData);

    function isModuleType(uint256 moduleTypeId) external pure returns (bool);

    function onInstall(bytes calldata data) external;

    function onUninstall(bytes calldata data) external;

    function isValidSignatureWithSender(address sender, bytes32 hash, bytes calldata data) external view returns (bytes4);

    function isInitialized(address smartAccount) external view returns (bool);
}
