// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SentinelListLib } from "sentinellist/src/SentinelList.sol";
import { CallType } from "../../lib/ModeLib.sol";

import { IHook } from "../modules/IERC7579Modules.sol";

interface IStorage {
    /// @custom:storage-location erc7201:biconomy.storage.SmartAccount
    struct AccountStorage {
        // linked list of validators. List is initialized by initialize()
        SentinelListLib.SentinelList validators;
        // linked list of executors. List is initialized by initialize()
        SentinelListLib.SentinelList executors;
        // mapping of selector to fallback handler
        mapping(bytes4 selector => FallbackHandler fallbackHandler) fallbacks;
        IHook hook;
    }

    struct FallbackHandler {
        address handler;
        CallType calltype;
    }
}
