// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.25;

import { IERC7579Account } from "../../interfaces/IERC7579Account.sol";
import { Execution } from "../../types/DataTypes.sol";
import { RebalancingBase } from "../../base/RebalancingBase.sol";
import { InitializableUniswapV3Integration } from "../../utils/uniswap/UniswapIntegration.sol";
import { IERC20 } from "forge-std/interfaces/IERC20.sol";
import { ModeLib } from "../../lib/ModeLib.sol";
import { ExecLib } from "../../lib/ExecLib.sol";

contract ScheduledOrders is RebalancingBase, InitializableUniswapV3Integration {
    error InvalidSqrtPriceLimitX96();

    struct SwapOrderInfo {
        address sellToken;
        address buyToken;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint24 fee;
    }

    function onInstall(bytes calldata data) external override {
        address swapRouter = address(bytes20(data[:20]));

        setSwapRouter(swapRouter);

        _onInstall();
    }

    function onUninstall(bytes calldata) external override {
        _deinitSwapRouter();
        _onUninstall();
    }

    /*//////////////////////////////////////////////////////////////////////////
                                     MODULE LOGIC
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * Executes a scheduled swap order
     *
     * @param jobId unique identifier for the job
     */
    function executeOrder(uint256 jobId, bytes memory data) external canExecute(jobId) {
        ExecutionConfig storage executionConfig = executionLog[msg.sender][jobId];

        SwapOrderInfo[] memory infos = abi.decode(data, (SwapOrderInfo[]));

        Execution[] memory executions = new Execution[](infos.length * 2);

        for (uint i = 0; i < infos.length; ++i) {
            Execution[] memory currentExecutions = _approveAndSwap({
                smartAccount: msg.sender,
                tokenIn: IERC20(infos[i].sellToken),
                tokenOut: IERC20(infos[i].buyToken),
                amountIn: infos[i].amountIn,
                sqrtPriceLimitX96: 0,
                amountOutMinimum: infos[i].amountOutMinimum,
                fee: infos[i].fee
            });

            // Manually copy the executions
            executions[i * 2] = currentExecutions[0];
            executions[i * 2 + 1] = currentExecutions[1];
        }

        executionConfig.lastExecutionTime = uint48(block.timestamp);
        executionConfig.numberOfExecutionsCompleted += 1;

        IERC7579Account(msg.sender).executeFromExecutor(ModeLib.encodeSimpleBatch(), ExecLib.encodeBatch(executions));

        emit ExecutionTriggered(msg.sender, jobId);
    }

    /*//////////////////////////////////////////////////////////////////////////
                                     METADATA
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * Returns the name of the module
     *
     * @return name of the module
     */
    function name() external pure virtual returns (string memory) {
        return "Rebalancing executor";
    }

    /**
     * Returns the version of the module
     *
     * @return version of the module
     */
    function version() external pure virtual returns (string memory) {
        return "1.0.0";
    }
}
