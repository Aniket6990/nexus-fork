export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "smartAccount",
        type: "address",
      },
    ],
    name: "AlreadyInitialized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "validAfter",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "validUntil",
        type: "uint256",
      },
    ],
    name: "ERC20SKV_InvalidDuration",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC20SKV_InvalidFunctionSelector",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC20SKV_InvalidSessionKey",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC20SKV_InvalidSpendingLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC20SKV_InvalidToken",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC20SKV_ModuleAlreadyInstalled",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC20SKV_ModuleNotInstalled",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sessionKey",
        type: "address",
      },
    ],
    name: "ERC20SKV_SessionKeyAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "session",
        type: "address",
      },
    ],
    name: "ERC20SKV_SessionKeyDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sessionKey",
        type: "address",
      },
    ],
    name: "ERC20SKV_SessionPaused",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "InvalidTargetAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "NotImplemented",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "smartAccount",
        type: "address",
      },
    ],
    name: "NotInitialized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "ERC20SKV_ModuleInstalled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "ERC20SKV_ModuleUninstalled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes4",
        name: "sel",
        type: "bytes4",
      },
    ],
    name: "ERC20SKV_NotUsingExecuteFunction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "sessionSelector",
        type: "bytes4",
      },
    ],
    name: "ERC20SKV_SelectorError",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sessionKey",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "ERC20SKV_SessionKeyDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sessionKey",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "ERC20SKV_SessionKeyEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_sessionKey",
        type: "address",
      },
    ],
    name: "ERC20SKV_SessionKeyIsNotLive",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sessionKey",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "ERC20SKV_SessionKeyPaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sessionKey",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "ERC20SKV_SessionKeyUnpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sessionSpendingLimit",
        type: "uint256",
      },
    ],
    name: "ERC20SKV_SpendingLimitError",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sessionToken",
        type: "address",
      },
    ],
    name: "ERC20SKV_TokenError",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "CallType",
        name: "calltype",
        type: "bytes1",
      },
    ],
    name: "ERC20SKV_UnsupportedCallType",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_session",
        type: "address",
      },
    ],
    name: "disableSessionKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_sessionData",
        type: "bytes",
      },
    ],
    name: "enableSessionKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAssociatedSessionKeys",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sessionKey",
        type: "address",
      },
    ],
    name: "getSessionKeyData",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "bytes4",
            name: "funcSelector",
            type: "bytes4",
          },
          {
            internalType: "uint256",
            name: "spendingLimit",
            type: "uint256",
          },
          {
            internalType: "uint48",
            name: "validAfter",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "validUntil",
            type: "uint48",
          },
          {
            internalType: "bool",
            name: "live",
            type: "bool",
          },
        ],
        internalType: "struct IERC20SessionKeyValidator.SessionData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "initialized",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "smartAccount",
        type: "address",
      },
    ],
    name: "isInitialized",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "moduleTypeId",
        type: "uint256",
      },
    ],
    name: "isModuleType",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sessionKey",
        type: "address",
      },
    ],
    name: "isSessionKeyLive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "isValidSignatureWithSender",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onInstall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onUninstall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_oldSessionKey",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_newSessionData",
        type: "bytes",
      },
    ],
    name: "rotateSessionKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sessionKey",
        type: "address",
      },
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "sessionData",
    outputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "funcSelector",
        type: "bytes4",
      },
      {
        internalType: "uint256",
        name: "spendingLimit",
        type: "uint256",
      },
      {
        internalType: "uint48",
        name: "validAfter",
        type: "uint48",
      },
      {
        internalType: "uint48",
        name: "validUntil",
        type: "uint48",
      },
      {
        internalType: "bool",
        name: "live",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sessionKey",
        type: "address",
      },
    ],
    name: "toggleSessionKeyPause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sessionKey",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "initCode",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
          {
            internalType: "bytes32",
            name: "accountGasLimits",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "gasFees",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "paymasterAndData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct PackedUserOperation",
        name: "userOp",
        type: "tuple",
      },
    ],
    name: "validateSessionKeyParams",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "initCode",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
          {
            internalType: "bytes32",
            name: "accountGasLimits",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "gasFees",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "paymasterAndData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct PackedUserOperation",
        name: "userOp",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "userOpHash",
        type: "bytes32",
      },
    ],
    name: "validateUserOp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "walletSessionKeys",
    outputs: [
      {
        internalType: "address",
        name: "assocSessionKeys",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const bytecode =
  "0x608060405234801561001057600080fd5b506134ad806100206000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c806397003203116100a2578063d60b347f11610071578063d60b347f146102f1578063d8d38e4214610321578063e08dd0081461033d578063ecd059611461035b578063f551e2ee1461038b5761010b565b80639700320314610245578063c037ee1914610275578063c602e59c146102a5578063cbca47db146102c15761010b565b80636d61fe70116100de5780636d61fe70146101ad5780638494ffa8146101c95780638a91b0e3146101f95780638aaa6a40146102155761010b565b8063110891c11461011057806320cbdcc614610140578063495079a01461015c57806352721fdd14610178575b600080fd5b61012a6004803603810190610125919061289f565b6103bb565b60405161013791906129e6565b60405180910390f35b61015a6004803603810190610155919061289f565b610579565b005b61017660048036038101906101719190612a66565b610729565b005b610192600480360381019061018d9190612ab3565b610dc4565b6040516101a496959493929190612b3e565b60405180910390f35b6101c760048036038101906101c29190612a66565b610e6b565b005b6101e360048036038101906101de919061289f565b610f86565b6040516101f09190612b9f565b60405180910390f35b610213600480360381019061020e9190612a66565b61101c565b005b61022f600480360381019061022a9190612be6565b6112d4565b60405161023c9190612c26565b60405180910390f35b61025f600480360381019061025a9190612c9c565b611322565b60405161026c9190612cf8565b60405180910390f35b61028f600480360381019061028a9190612d13565b61156e565b60405161029c9190612b9f565b60405180910390f35b6102bf60048036038101906102ba9190612d6f565b611d25565b005b6102db60048036038101906102d6919061289f565b611d3d565b6040516102e89190612b9f565b60405180910390f35b61030b6004803603810190610306919061289f565b611d5d565b6040516103189190612b9f565b60405180910390f35b61033b6004803603810190610336919061289f565b611db2565b005b61034561203b565b6040516103529190612e7e565b60405180910390f35b61037560048036038101906103709190612ea0565b612106565b6040516103829190612b9f565b60405180910390f35b6103a560048036038101906103a09190612ecd565b612113565b6040516103b29190612f41565b60405180910390f35b6103c36126f2565b600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040518060c00160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016000820160149054906101000a900460e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001600182015481526020016002820160009054906101000a900465ffffffffffff1665ffffffffffff1665ffffffffffff1681526020016002820160069054906101000a900465ffffffffffff1665ffffffffffff1665ffffffffffff16815260200160028201600c9054906101000a900460ff1615151515815250509050919050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020905060008160020160069054906101000a900465ffffffffffff1665ffffffffffff160361065c57816040517fad559b380000000000000000000000000000000000000000000000000000000081526004016106539190612c26565b60405180910390fd5b80600201600c9054906101000a900460ff16156106ce57600081600201600c6101000a81548160ff0219169083151502179055507ff5eec43346204709e3490be81892a0abceba36de8afb2c87c9c8b62565cf0a7b82336040516106c1929190612f5c565b60405180910390a1610725565b600181600201600c6101000a81548160ff0219169083151502179055507fdafe9b16860cb2a92db27f042fbea578512b3290e6025be770cafb9f82d253ae823360405161071c929190612f5c565b60405180910390a15b5050565b6000828260009060149261073f93929190612f8f565b9061074a919061300e565b60601c9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036107b5576040517f6ed16c7900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160069054906101000a900465ffffffffffff1665ffffffffffff161415801561086c575061086b61086561203b565b82612147565b5b156108ae57806040517fa7428dce0000000000000000000000000000000000000000000000000000000081526004016108a59190612c26565b60405180910390fd5b600083836014906028926108c493929190612f8f565b906108cf919061300e565b60601c9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361093a576040517f1932ec4600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008484602890602c9261095093929190612f8f565b9061095b919061306d565b9050600060e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916036109d8576040517fb17e3ec300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008585602c90604c926109ee93929190612f8f565b906109f991906130cc565b60001c905060008103610a38576040517f171c5d6100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008686604c90605292610a4e93929190612f8f565b90610a599190613157565b60d01c905060008787605290605892610a7493929190612f8f565b90610a7f9190613157565b60d01c90508165ffffffffffff168165ffffffffffff16111580610aab575060008165ffffffffffff16145b80610abe575060008265ffffffffffff16145b15610b025781816040517f14d8e90a000000000000000000000000000000000000000000000000000000008152600401610af99291906131f1565b60405180910390fd5b6040518060c001604052808673ffffffffffffffffffffffffffffffffffffffff168152602001857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020018481526020018365ffffffffffff1681526020018265ffffffffffff16815260200160011515815250600260008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a81548163ffffffff021916908360e01c02179055506040820151816001015560608201518160020160006101000a81548165ffffffffffff021916908365ffffffffffff16021790555060808201518160020160066101000a81548165ffffffffffff021916908365ffffffffffff16021790555060a082015181600201600c6101000a81548160ff021916908315150217905550905050600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020869080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f3c8d6097a1246293dc66a3eeb0db267cb28a5b6c3367e2de5f331659222eb1ff8633604051610db2929190612f5c565b60405180910390a15050505050505050565b6002602052816000526040600020602052806000526040600020600091509150508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060000160149054906101000a900460e01b908060010154908060020160009054906101000a900465ffffffffffff16908060020160069054906101000a900465ffffffffffff169080600201600c9054906101000a900460ff16905086565b600115156000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151503610ef4576040517f9fb25a0500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60016000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055507fa6d916f9c8039923d6c8929c933b9417bdeeceb2dfbb39525b8a2269094d5e3c33604051610f7a9190612c26565b60405180910390a15050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600201600c9054906101000a900460ff169050919050565b600015156000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515036110a5576040517fbdebe0b800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006110af61203b565b905060008151905060005b818110156111f457600260008483815181106110d9576110d861321a565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549063ffffffff021916905560018201600090556002820160006101000a81549065ffffffffffff02191690556002820160066101000a81549065ffffffffffff021916905560028201600c6101000a81549060ff0219169055505080806001019150506110ba565b50600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000611240919061276f565b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055507fd168e595dbfa90dd76eed9c2c9b6c3a9892ae9e79dd68661b0e26f30c582cd4d336040516112c69190612c26565b60405180910390a150505050565b600160205281600052604060002081815481106112f057600080fd5b906000526020600020016000915091509054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600080611382838580610100019061133a9190613258565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050612161565b905061138e818561156e565b61139c576001915050611568565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040518060c00160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016000820160149054906101000a900460e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001600182015481526020016002820160009054906101000a900465ffffffffffff1665ffffffffffff1665ffffffffffff1681526020016002820160069054906101000a900465ffffffffffff1665ffffffffffff1665ffffffffffff16815260200160028201600c9054906101000a900460ff16151515158152505090506115636000826080015183606001516121fc565b925050505b92915050565b600080600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206040518060c00160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016000820160149054906101000a900460e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001600182015481526020016002820160009054906101000a900465ffffffffffff1665ffffffffffff1665ffffffffffff1681526020016002820160069054906101000a900465ffffffffffff1665ffffffffffff1665ffffffffffff16815260200160028201600c9054906101000a900460ff16151515158152505090506000151561172f85610f86565b151503611777577fc78e70617167f61cf0a7154ae2b692bcafe1f4da06265f72ea8d453d8aa612e8846040516117659190612c26565b60405180910390a16000915050611d1f565b600036600085806060019061178c9190613258565b91509150600082826000906004926117a693929190612f8f565b906117b1919061306d565b905063e9ae5c5360e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611cde576000838360049060249261181593929190612f8f565b9061182091906130cc565b9050600061182d82612235565b505050905061184081600060f81b612257565b15611a25573660006118638787606490809261185e93929190612f8f565b6122a8565b909150818194509450829a505050506000806000806118828686612316565b93509350935093508c6000015173ffffffffffffffffffffffffffffffffffffffff168c73ffffffffffffffffffffffffffffffffffffffff1614611914577f85ff020e1ab7d2c0e31cac89085db7e881a028d85ac03df623e769f1a09bd6908c8e600001516040516118f6929190612f5c565b60405180910390a160009d5050505050505050505050505050611d1f565b8c602001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916146119b0577fb0a4c7ebea4aeacb5e1df0f96fcd4db4abb1d2f4349575d5a55539c8ee72380a848e602001516040516119929291906132bb565b60405180910390a160009d5050505050505050505050505050611d1f565b8c60400151811115611a0f577fea5e4e305af0595224ca2e94d87ea43e6a3cf203ac02c8b6039d5de50621e68f818e604001516040516119f19291906132e4565b60405180910390a160009d5050505050505050505050505050611d1f565b60019d5050505050505050505050505050611d1f565b611a3381600160f81b612257565b15611c9757366000611a5687876064908092611a5193929190612f8f565b612506565b9150915060005b82829050811015611c8457828282818110611a7b57611a7a61321a565b5b9050602002810190611a8d919061330d565b6000016020810190611a9f919061289f565b9850600080600080611ae3878787818110611abd57611abc61321a565b5b9050602002810190611acf919061330d565b8060400190611ade9190613258565b612316565b93509350935093508d6000015173ffffffffffffffffffffffffffffffffffffffff168d73ffffffffffffffffffffffffffffffffffffffff1614611b76577f85ff020e1ab7d2c0e31cac89085db7e881a028d85ac03df623e769f1a09bd6908d8f60000151604051611b57929190612f5c565b60405180910390a160009e505050505050505050505050505050611d1f565b8d602001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611c13577fb0a4c7ebea4aeacb5e1df0f96fcd4db4abb1d2f4349575d5a55539c8ee72380a848f60200151604051611bf49291906132bb565b60405180910390a160009e505050505050505050505050505050611d1f565b8d60400151811115611c73577fea5e4e305af0595224ca2e94d87ea43e6a3cf203ac02c8b6039d5de50621e68f818f60400151604051611c549291906132e4565b60405180910390a160009e505050505050505050505050505050611d1f565b505050508080600101915050611a5d565b5060019950505050505050505050611d1f565b7fbb1f40d4feb44a50c8a90af9c34fbd4a675013f331b76c23ab2ef4dd582fc53781604051611cc69190613382565b60405180910390a16000975050505050505050611d1f565b7fd502458084d6d3f54f424f54da29a5900f9709ba2503af48f3a35f03042afb2a81604051611d0d9190612f41565b60405180910390a16000955050505050505b92915050565b611d2e83611db2565b611d388282610729565b505050565b60006020528060005260406000206000915054906101000a900460ff1681565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020160069054906101000a900465ffffffffffff1665ffffffffffff1603611e9057806040517fad559b38000000000000000000000000000000000000000000000000000000008152600401611e879190612c26565b60405180910390fd5b600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549063ffffffff021916905560018201600090556002820160006101000a81549065ffffffffffff02191690556002820160066101000a81549065ffffffffffff021916905560028201600c6101000a81549060ff02191690555050611fac611fa661203b565b8261251f565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209080519060200190611ffe929190612790565b507f3552ecdbdb725cc8b621be8a316008bbcb5bc1e72e9a6b08da9b20bd7f78266d8133604051612030929190612f5c565b60405180910390a150565b6060600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054806020026020016040519081016040528092919081815260200182805480156120fc57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116120b2575b5050505050905090565b6000600182149050919050565b60006040517fd623472500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000806121548484612665565b9150508091505092915050565b6000600190506040516001156121cb5783600052602083015160405260408351036121a5576040830151601b8160ff1c016020528060011b60011c606052506121cb565b60418351036121c657606083015160001a60205260408301516060526121cb565b600091505b6020600160806000855afa5191503d6121ec57638baa579f6000526004601cfd5b6000606052806040525092915050565b600060d08265ffffffffffff16901b60a08465ffffffffffff16901b85612224576000612227565b60015b60ff16171790509392505050565b6000806000808493508460081b92508460301b91508460501b90509193509193565b6000817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916837effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614905092915050565b60008036600085856000906014926122c293929190612f8f565b906122cd919061300e565b60601c935085856014906034926122e693929190612f8f565b906122f191906130cc565b60001c92508585603490809261230993929190612f8f565b9150915092959194509250565b600080600080858560009060049261233093929190612f8f565b9061233b919061306d565b935063095ea7b360e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806123d4575063a9059cbb60e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b1561242d5785856010906024926123ed93929190612f8f565b906123f8919061300e565b60601c9150858560249060449261241193929190612f8f565b9061241c91906130cc565b60001c9050836000935093506124fd565b6323b872dd60e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916847bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916036124ea57858560109060249261248d93929190612f8f565b90612498919061300e565b60601c925085856030906044926124b193929190612f8f565b906124bc919061300e565b60601c915085856044906064926124d593929190612f8f565b906124e091906130cc565b60001c90506124fd565b600060e01b600080600093509350935093505b92959194509250565b3660008335840160208101925080359150509250929050565b606060006001845161253191906133cc565b67ffffffffffffffff81111561254a57612549613400565b5b6040519080825280602002602001820160405280156125785781602001602082028036833780820191505090505b5090506000805b8551811015612659578473ffffffffffffffffffffffffffffffffffffffff168682815181106125b2576125b161321a565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff161461264c578581815181106125e8576125e761321a565b5b60200260200101518383815181106126035761260261321a565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505081806126489061342f565b9250505b808060010191505061257f565b50819250505092915050565b60008060008451905060005b818110156126e1578473ffffffffffffffffffffffffffffffffffffffff168682815181106126a3576126a261321a565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff16036126d4578060019350935050506126eb565b8080600101915050612671565b5060008092509250505b9250929050565b6040518060c00160405280600073ffffffffffffffffffffffffffffffffffffffff16815260200160007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160008152602001600065ffffffffffff168152602001600065ffffffffffff1681526020016000151581525090565b508054600082559060005260206000209081019061278d919061281a565b50565b828054828255906000526020600020908101928215612809579160200282015b828111156128085782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550916020019190600101906127b0565b5b509050612816919061281a565b5090565b5b8082111561283357600081600090555060010161281b565b5090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061286c82612841565b9050919050565b61287c81612861565b811461288757600080fd5b50565b60008135905061289981612873565b92915050565b6000602082840312156128b5576128b4612837565b5b60006128c38482850161288a565b91505092915050565b6128d581612861565b82525050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b612910816128db565b82525050565b6000819050919050565b61292981612916565b82525050565b600065ffffffffffff82169050919050565b61294a8161292f565b82525050565b60008115159050919050565b61296581612950565b82525050565b60c08201600082015161298160008501826128cc565b5060208201516129946020850182612907565b5060408201516129a76040850182612920565b5060608201516129ba6060850182612941565b5060808201516129cd6080850182612941565b5060a08201516129e060a085018261295c565b50505050565b600060c0820190506129fb600083018461296b565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f840112612a2657612a25612a01565b5b8235905067ffffffffffffffff811115612a4357612a42612a06565b5b602083019150836001820283011115612a5f57612a5e612a0b565b5b9250929050565b60008060208385031215612a7d57612a7c612837565b5b600083013567ffffffffffffffff811115612a9b57612a9a61283c565b5b612aa785828601612a10565b92509250509250929050565b60008060408385031215612aca57612ac9612837565b5b6000612ad88582860161288a565b9250506020612ae98582860161288a565b9150509250929050565b612afc81612861565b82525050565b612b0b816128db565b82525050565b612b1a81612916565b82525050565b612b298161292f565b82525050565b612b3881612950565b82525050565b600060c082019050612b536000830189612af3565b612b606020830188612b02565b612b6d6040830187612b11565b612b7a6060830186612b20565b612b876080830185612b20565b612b9460a0830184612b2f565b979650505050505050565b6000602082019050612bb46000830184612b2f565b92915050565b612bc381612916565b8114612bce57600080fd5b50565b600081359050612be081612bba565b92915050565b60008060408385031215612bfd57612bfc612837565b5b6000612c0b8582860161288a565b9250506020612c1c85828601612bd1565b9150509250929050565b6000602082019050612c3b6000830184612af3565b92915050565b600080fd5b60006101208284031215612c5d57612c5c612c41565b5b81905092915050565b6000819050919050565b612c7981612c66565b8114612c8457600080fd5b50565b600081359050612c9681612c70565b92915050565b60008060408385031215612cb357612cb2612837565b5b600083013567ffffffffffffffff811115612cd157612cd061283c565b5b612cdd85828601612c46565b9250506020612cee85828601612c87565b9150509250929050565b6000602082019050612d0d6000830184612b11565b92915050565b60008060408385031215612d2a57612d29612837565b5b6000612d388582860161288a565b925050602083013567ffffffffffffffff811115612d5957612d5861283c565b5b612d6585828601612c46565b9150509250929050565b600080600060408486031215612d8857612d87612837565b5b6000612d968682870161288a565b935050602084013567ffffffffffffffff811115612db757612db661283c565b5b612dc386828701612a10565b92509250509250925092565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000612e0783836128cc565b60208301905092915050565b6000602082019050919050565b6000612e2b82612dcf565b612e358185612dda565b9350612e4083612deb565b8060005b83811015612e71578151612e588882612dfb565b9750612e6383612e13565b925050600181019050612e44565b5085935050505092915050565b60006020820190508181036000830152612e988184612e20565b905092915050565b600060208284031215612eb657612eb5612837565b5b6000612ec484828501612bd1565b91505092915050565b60008060008060608587031215612ee757612ee6612837565b5b6000612ef58782880161288a565b9450506020612f0687828801612c87565b935050604085013567ffffffffffffffff811115612f2757612f2661283c565b5b612f3387828801612a10565b925092505092959194509250565b6000602082019050612f566000830184612b02565b92915050565b6000604082019050612f716000830185612af3565b612f7e6020830184612af3565b9392505050565b600080fd5b600080fd5b60008085851115612fa357612fa2612f85565b5b83861115612fb457612fb3612f8a565b5b6001850283019150848603905094509492505050565b600082905092915050565b60007fffffffffffffffffffffffffffffffffffffffff00000000000000000000000082169050919050565b600082821b905092915050565b600061301a8383612fca565b826130258135612fd5565b92506014821015613065576130607fffffffffffffffffffffffffffffffffffffffff00000000000000000000000083601403600802613001565b831692505b505092915050565b60006130798383612fca565b8261308481356128db565b925060048210156130c4576130bf7fffffffff0000000000000000000000000000000000000000000000000000000083600403600802613001565b831692505b505092915050565b60006130d88383612fca565b826130e38135612c66565b925060208210156131235761311e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83602003600802613001565b831692505b505092915050565b60007fffffffffffff000000000000000000000000000000000000000000000000000082169050919050565b60006131638383612fca565b8261316e813561312b565b925060068210156131ae576131a97fffffffffffff000000000000000000000000000000000000000000000000000083600603600802613001565b831692505b505092915050565b6000819050919050565b60006131db6131d66131d18461292f565b6131b6565b612916565b9050919050565b6131eb816131c0565b82525050565b600060408201905061320660008301856131e2565b61321360208301846131e2565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b6000808335600160200384360303811261327557613274613249565b5b80840192508235915067ffffffffffffffff8211156132975761329661324e565b5b6020830192506001820236038313156132b3576132b2613253565b5b509250929050565b60006040820190506132d06000830185612b02565b6132dd6020830184612b02565b9392505050565b60006040820190506132f96000830185612b11565b6133066020830184612b11565b9392505050565b60008235600160600383360303811261332957613328613249565b5b80830191505092915050565b60007fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b600061336c82613335565b9050919050565b61337c81613361565b82525050565b60006020820190506133976000830184613373565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006133d782612916565b91506133e283612916565b92508282039050818111156133fa576133f961339d565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600061343a82612916565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361346c5761346b61339d565b5b60018201905091905056fea26469706673582212209167b9e20a3629c804f076fb0e11426ec9848597fe38989ba3d8e524fbb4143764736f6c63430008170033";
