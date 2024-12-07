// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import { ERC7579ExecutorBase } from "./ERC7579ExecutorBase.sol";

abstract contract RebalancingBase is ERC7579ExecutorBase {
    /*//////////////////////////////////////////////////////////////////////////
                            CONSTANTS & STORAGE
    //////////////////////////////////////////////////////////////////////////*/

    error InvalidExecution();

    event ExecutionAdded(address indexed smartAccount, uint256 indexed jobId);
    event ExecutionTriggered(address indexed smartAccount, uint256 indexed jobId);
    event ExecutionStatusUpdated(address indexed smartAccount, uint256 indexed jobId);
    event ExecutionsCancelled(address indexed smartAccount);

    mapping(address => bool) public initialized;

    mapping(address smartAccount => mapping(uint256 jobId => ExecutionConfig)) public executionLog;

    mapping(address smartAccount => uint256 jobCount) public accountJobCount;

    struct ExecutionConfig {
        uint16 numberOfExecutionsCompleted;
        uint48 startDate;
        bool isEnabled;
        uint48 lastExecutionTime;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                     CONFIG
    //////////////////////////////////////////////////////////////////////////*/

    function _onInstall() internal {
        address account = msg.sender;
        if (isInitialized(account)) {
            revert AlreadyInitialized(account);
        }
        initialized[msg.sender] = true;
    }

    function _onUninstall() internal {
        address account = msg.sender;

        uint256 count = accountJobCount[account];
        for (uint256 i = 1; i <= count; i++) {
            delete executionLog[account][i];
        }
        accountJobCount[account] = 0;
        initialized[msg.sender] = false;

        emit ExecutionsCancelled(account);
    }

    function isInitialized(address smartAccount) public view returns (bool) {
        return initialized[smartAccount];
    }

    function addOrder(bytes calldata orderData) external {
        address account = msg.sender;
        if (!isInitialized(account)) revert NotInitialized(account);

        _createExecution({ orderData: orderData });
    }

    function toggleOrder(uint256 jobId) external {
        address account = msg.sender;

        ExecutionConfig storage executionConfig = executionLog[account][jobId];

        executionConfig.isEnabled = !executionConfig.isEnabled;

        emit ExecutionStatusUpdated(account, jobId);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                     INTERNAL
    //////////////////////////////////////////////////////////////////////////*/

    function _createExecution(bytes calldata orderData) internal {
        address account = msg.sender;

        uint256 jobId = accountJobCount[account] + 1;
        accountJobCount[account]++;

        // prevent user from supplying an invalid number of execution (0)
        uint48 startDate = uint48(bytes6(orderData[0:6]));
        if (startDate < block.timestamp) revert InvalidExecution();

        executionLog[account][jobId] = ExecutionConfig({
            numberOfExecutionsCompleted: 0,
            isEnabled: true,
            lastExecutionTime: 0,
            startDate: uint48(bytes6(orderData[0:6]))
        });

        emit ExecutionAdded(account, jobId);
    }

    function _isExecutionValid(uint256 jobId) internal view {
        ExecutionConfig storage executionConfig = executionLog[msg.sender][jobId];

        if (!executionConfig.isEnabled) {
            revert InvalidExecution();
        }
    }

    modifier canExecute(uint256 jobId) {
        _isExecutionValid(jobId);
        _;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                     METADATA
    //////////////////////////////////////////////////////////////////////////*/

    function isModuleType(uint256 typeID) external pure override returns (bool) {
        return typeID == TYPE_EXECUTOR;
    }
}