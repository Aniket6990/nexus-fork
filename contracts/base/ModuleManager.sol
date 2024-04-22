// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Storage } from "./Storage.sol";
import { IModule, IValidator, IExecutor, IFallback, IHook } from "../interfaces/modules/IERC7579Modules.sol";
import { MODULE_TYPE_VALIDATOR, MODULE_TYPE_EXECUTOR, MODULE_TYPE_HOOK } from "../interfaces/modules/IERC7579Modules.sol";
import { Receiver } from "solady/src/accounts/Receiver.sol";
import { SentinelListLib } from "sentinellist/src/SentinelList.sol";
import { CallType, CALLTYPE_SINGLE, CALLTYPE_STATIC } from "../lib/ModeLib.sol";

// Note: importing Receiver.sol from solady (but can make custom one for granular control for fallback management)
// Review: This contract could also act as fallback manager rather than having a separate contract
// Review: Kept a different linked list for validators, executors

/**
 * @title ModuleManager
 * @dev This contract manages Validator, Executor, Hook and Fallback modules for the MSA
 * @dev it uses SentinelList to manage the linked list of modules
 * shoutout to zeroknots (rhinestone.wtf) for this code
 * NOTE: the linked list is just an example. accounts may implement this differently
 */
abstract contract ModuleManager is Storage, Receiver {
    error CannotRemoveLastValidator();
    error InvalidModule(address module);
    error InvalidModuleTypeId(uint256 moduleTypeId);
    error ModuleAlreadyInstalled(uint256 moduleTypeId, address module);
    error UnauthorizedOperation(address operator);
    error ModuleNotInstalled(uint256 moduleTypeId, address module);
    error IncompatibleValidatorModule(address module);
    error IncompatibleExecutorModule(address module);
    error IncompatibleHookModule(address module);
    error ModuleAddressCanNotBeZero();
    error HookPostCheckFailed();
    error HookAlreadyInstalled(address currentHook);
    error FallbackAlreadyInstalledForSelector(bytes4 selector);
    error FallbackNotInstalledForSelector(bytes4 selector);
    error FallbackHandlerUninstallFailed();
    error NoFallbackHandler(bytes4 selector);

    using SentinelListLib for SentinelListLib.SentinelList;

    function _preCheck() internal returns (address hook, bytes memory hookData) {
        hook = _getHook();
        if (hook != address(0)) {
            hookData = IHook(hook).preCheck(msg.sender, msg.value, msg.data);
            return (hook, hookData);
        }
    }

    function _postCheck(
        address hook,
        bytes memory hookData,
        bool executionSuccess,
        bytes memory executionReturnValue
    ) internal {
        if (hook != address(0)) {
            IHook(hook).postCheck(hookData, executionSuccess, executionReturnValue);
        }
    }

    modifier onlyExecutorModule() virtual {
        SentinelListLib.SentinelList storage executors = _getAccountStorage().executors;
        if (!executors.contains(msg.sender)) revert InvalidModule(msg.sender);
        _;
    }

    modifier onlyValidatorModule(address validator) virtual {
        SentinelListLib.SentinelList storage validators = _getAccountStorage().validators;
        if (!validators.contains(validator)) revert InvalidModule(validator);
        _;
    }

    fallback() external payable override(Receiver) receiverFallback {
        FallbackHandler storage $fallbackHandler = _getAccountStorage().fallbacks[msg.sig];
        address handler = $fallbackHandler.handler;
        CallType calltype = $fallbackHandler.calltype;
        if (handler == address(0)) revert NoFallbackHandler(msg.sig);

        if (calltype == CALLTYPE_STATIC) {
            assembly {
                function allocate(length) -> pos {
                    pos := mload(0x40)
                    mstore(0x40, add(pos, length))
                }

                let calldataPtr := allocate(calldatasize())
                calldatacopy(calldataPtr, 0, calldatasize())

                // The msg.sender address is shifted to the left by 12 bytes to remove the padding
                // Then the address without padding is stored right after the calldata
                let senderPtr := allocate(20)
                mstore(senderPtr, shl(96, caller()))

                // Add 20 bytes for the address appended add the end
                let success := staticcall(gas(), handler, calldataPtr, add(calldatasize(), 20), 0, 0)

                let returnDataPtr := allocate(returndatasize())
                returndatacopy(returnDataPtr, 0, returndatasize())
                if iszero(success) {
                    revert(returnDataPtr, returndatasize())
                }
                return(returnDataPtr, returndatasize())
            }
        }
        if (calltype == CALLTYPE_SINGLE) {
            assembly {
                function allocate(length) -> pos {
                    pos := mload(0x40)
                    mstore(0x40, add(pos, length))
                }

                let calldataPtr := allocate(calldatasize())
                calldatacopy(calldataPtr, 0, calldatasize())

                // The msg.sender address is shifted to the left by 12 bytes to remove the padding
                // Then the address without padding is stored right after the calldata
                let senderPtr := allocate(20)
                mstore(senderPtr, shl(96, caller()))

                // Add 20 bytes for the address appended add the end
                let success := call(gas(), handler, 0, calldataPtr, add(calldatasize(), 20), 0, 0)

                let returnDataPtr := allocate(returndatasize())
                returndatacopy(returnDataPtr, 0, returndatasize())
                if iszero(success) {
                    revert(returnDataPtr, returndatasize())
                }
                return(returnDataPtr, returndatasize())
            }
        }
    }

    /**
     * THIS IS NOT PART OF THE STANDARD
     * Helper Function to access linked list
     */
    function getValidatorsPaginated(
        address cursor,
        uint256 size
    ) external view virtual returns (address[] memory array, address next) {
        (array, next) = _getValidatorsPaginated(cursor, size);
    }

    /**
     * THIS IS NOT PART OF THE STANDARD
     * Helper Function to access linked list
     */
    function getExecutorsPaginated(
        address cursor,
        uint256 size
    ) external view virtual returns (address[] memory array, address next) {
        (array, next) = _getExecutorsPaginated(cursor, size);
    }

    function getActiveHook() external view returns (address hook) {
        return _getHook();
    }

    function getFallbackHandlerBySelector(bytes4 selector) external view returns (CallType, address) {
        FallbackHandler memory handler = _getAccountStorage().fallbacks[selector];
        return (handler.calltype, handler.handler);
    }

    function _initModuleManager() internal virtual {
        // account module storage
        AccountStorage storage ams = _getAccountStorage();
        ams.executors.init();
        ams.validators.init();
    }

    // // TODO
    // // Review this agaisnt required hook/permissions at the time of installations
    function _installValidator(address validator, bytes calldata data) internal virtual {
        // Note: Idea is should be able to check supported interface and module type - eligible validator
        if (!IModule(validator).isModuleType(MODULE_TYPE_VALIDATOR)) revert IncompatibleValidatorModule(validator);

        SentinelListLib.SentinelList storage validators = _getAccountStorage().validators;
        validators.push(validator);
        IValidator(validator).onInstall(data);
    }

    function _uninstallValidator(address validator, bytes calldata data) internal virtual {
        // check if its the last validator. this might brick the account
        (address[] memory array, ) = _getValidatorsPaginated(address(0x1), 2);
        if (array.length == 1) {
            revert CannotRemoveLastValidator();
        }

        SentinelListLib.SentinelList storage validators = _getAccountStorage().validators;

        (address prev, bytes memory disableModuleData) = abi.decode(data, (address, bytes));
        validators.pop(prev, validator);
        IValidator(validator).onUninstall(disableModuleData);
    }

    // /////////////////////////////////////////////////////
    // //  Manage Executors
    // ////////////////////////////////////////////////////

    function _installExecutor(address executor, bytes calldata data) internal virtual {
        // Note: Idea is should be able to check supported interface and module type - eligible validator
        if (!IModule(executor).isModuleType(MODULE_TYPE_EXECUTOR)) revert IncompatibleExecutorModule(executor);

        SentinelListLib.SentinelList storage executors = _getAccountStorage().executors;
        executors.push(executor);
        IExecutor(executor).onInstall(data);
    }

    function _uninstallExecutor(address executor, bytes calldata data) internal virtual {
        SentinelListLib.SentinelList storage executors = _getAccountStorage().executors;
        (address prev, bytes memory disableModuleData) = abi.decode(data, (address, bytes));
        executors.pop(prev, executor);
        IExecutor(executor).onUninstall(disableModuleData);
    }

    // /////////////////////////////////////////////////////
    // //  Manage Hook
    // ////////////////////////////////////////////////////

    function _installHook(address hook, bytes calldata data) internal virtual {
        address currentHook = _getHook();
        if (currentHook != address(0)) {
            revert HookAlreadyInstalled(currentHook);
        }
        if (!IModule(hook).isModuleType(MODULE_TYPE_HOOK)) revert IncompatibleHookModule(hook);
        _setHook(hook);
        IHook(hook).onInstall(data);
    }

    function _uninstallHook(address hook, bytes calldata data) internal virtual {
        _setHook(address(0));
        IHook(hook).onUninstall(data);
    }

    function _setHook(address hook) internal virtual {
        _getAccountStorage().hook = IHook(hook);
    }

    function _installFallbackHandler(address handler, bytes calldata params) internal virtual {
        bytes4 selector = bytes4(params[0:4]);
        CallType calltype = CallType.wrap(bytes1(params[4]));
        bytes memory initData = params[5:];
        if (_isFallbackHandlerInstalled(selector)) revert FallbackAlreadyInstalledForSelector(selector);
        _getAccountStorage().fallbacks[selector] = FallbackHandler(handler, calltype);
        IFallback(handler).onInstall(initData);
    }

    function _uninstallFallbackHandler(address fallbackHandler, bytes calldata data) internal virtual {
        bytes4 selector = bytes4(data[0:4]);
        bytes memory deInitData = data[4:];
        if (!_isFallbackHandlerInstalled(selector)) revert FallbackNotInstalledForSelector(selector);
        _getAccountStorage().fallbacks[selector] = FallbackHandler(address(0), CallType.wrap(0x00));
        IFallback(fallbackHandler).onUninstall(deInitData);
    }

    function _isFallbackHandlerInstalled(bytes4 selector) internal view virtual returns (bool) {
        FallbackHandler storage handler = _getAccountStorage().fallbacks[selector];
        return handler.handler != address(0);
    }

    function _isFallbackHandlerInstalled(bytes4 selector, address expectedHandler) internal view returns (bool) {
        FallbackHandler storage handler = _getAccountStorage().fallbacks[selector];
        return handler.handler == expectedHandler;
    }

    function _isValidatorInstalled(address validator) internal view virtual returns (bool) {
        SentinelListLib.SentinelList storage validators = _getAccountStorage().validators;
        return validators.contains(validator);
    }

    function _isExecutorInstalled(address executor) internal view virtual returns (bool) {
        SentinelListLib.SentinelList storage executors = _getAccountStorage().executors;
        return executors.contains(executor);
    }

    function _isHookInstalled(address hook) internal view returns (bool) {
        return _getHook() == hook;
    }

    function _getHook() internal view returns (address hook) {
        hook = address(_getAccountStorage().hook);
    }

    function _getValidatorsPaginated(
        address cursor,
        uint256 size
    ) private view returns (address[] memory array, address next) {
        SentinelListLib.SentinelList storage validators = _getAccountStorage().validators;
        return validators.getEntriesPaginated(cursor, size);
    }

    function _getExecutorsPaginated(
        address cursor,
        uint256 size
    ) private view returns (address[] memory array, address next) {
        SentinelListLib.SentinelList storage executors = _getAccountStorage().executors;
        return executors.getEntriesPaginated(cursor, size);
    }
}
