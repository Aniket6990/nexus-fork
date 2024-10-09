// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { ECDSA } from "solady/utils/ECDSA.sol";
import { PackedUserOperation } from "account-abstraction/interfaces/PackedUserOperation.sol";
import { MODULE_TYPE_VALIDATOR, VALIDATION_SUCCESS, VALIDATION_FAILED } from "../../../contracts/types/Constants.sol";

contract SigValidator {
    mapping(address => address) public smartAccountOwners;

    /// @notice Error to indicate that no owner was provided during installation
    error NoOwnerProvided();

    /// @notice Called upon module installation to set the owner of the smart account
    /// @param data Encoded address of the owner
    function onInstall(bytes calldata data) external {
        require(data.length != 0, NoOwnerProvided());
        smartAccountOwners[msg.sender] = address(bytes20(data));
    }

    /// @notice Called upon module uninstallation to remove the owner of the smart account
    function onUninstall(bytes calldata) external {
        delete smartAccountOwners[msg.sender];
    }
    function isInitialized(address smartAccount) external view returns (bool) {
        return smartAccountOwners[smartAccount] != address(0);
    }

    function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) external view returns (uint256) {
        address owner = smartAccountOwners[userOp.sender];
        bytes calldata sig = userOp.signature;
        bytes32 ethHash = ECDSA.toEthSignedMessageHash(userOpHash);
        address recovered = ECDSA.recover(ethHash, sig);
        if (owner != recovered) {
            return VALIDATION_FAILED;
        }
        return VALIDATION_SUCCESS;
    }

    function name() external pure returns (string memory) {
        return "SigValidator";
    }

    function version() external pure returns (string memory) {
        return "1.0.0";
    }

    function isModuleType(uint256 typeID) external pure returns (bool) {
        return typeID == MODULE_TYPE_VALIDATOR;
    }
}