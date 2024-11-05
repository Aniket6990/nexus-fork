import {
  BigNumberish,
  BytesLike,
  concat,
  dataSlice,
  getAddress,
  getBigInt,
  hexlify,
  solidityPacked,
  toBeHex,
  ZeroAddress,
  zeroPadValue,
} from "ethers";
import { PackedUserOperation, UserOperation } from "./types";
import { toGwei } from "./encoding";

export function packGasValues(
  callGasLimit: BigNumberish,
  verificationGasLimit: BigNumberish,
  maxFeePerGas: BigNumberish,
  maxPriorityFeePerGas: BigNumberish,
) {
  const gasFees = solidityPacked(
    ["uint128", "uint128"],
    [maxPriorityFeePerGas, maxFeePerGas],
  );
  const accountGasLimits = solidityPacked(
    ["uint128", "uint128"],
    [callGasLimit, verificationGasLimit],
  );

  return { gasFees, accountGasLimits };
}

export function packPaymasterData(
  paymaster: string,
  paymasterVerificationGasLimit: BigNumberish,
  postOpGasLimit: BigNumberish,
  paymasterData: BytesLike,
): BytesLike {
  return concat([
    paymaster,
    zeroPadValue(toBeHex(Number(paymasterVerificationGasLimit)), 16),
    zeroPadValue(toBeHex(Number(postOpGasLimit)), 16),
    paymasterData,
  ]);
}

export function buildPackedUserOp(userOp: UserOperation): PackedUserOperation {
  const {
    sender,
    nonce,
    initCode = "0x",
    callData = "0x",
    callGasLimit = 1_500_000,
    verificationGasLimit = 1_500_000,
    preVerificationGas = 2_000_000,
    maxFeePerGas = toGwei("20"),
    maxPriorityFeePerGas = toGwei("10"),
    paymaster = ZeroAddress,
    paymasterData = "0x",
    paymasterVerificationGasLimit = 3_00_000,
    paymasterPostOpGasLimit = 0,
    signature = "0x",
  } = userOp;

  // Construct the gasFees and accountGasLimits in a single step to reduce repetition
  const packedValues = packGasValues(
    callGasLimit,
    verificationGasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
  );

  // Construct paymasterAndData only if a paymaster is specified
  // paymasterData can be generated before this stage
  let paymasterAndData: BytesLike = "0x";
  if (paymaster.toString().length >= 20 && paymaster !== ZeroAddress) {
    paymasterAndData = packPaymasterData(
      userOp.paymaster as string,
      paymasterVerificationGasLimit,
      paymasterPostOpGasLimit,
      paymasterData as string,
    );
  }

  // Return the PackedUserOperation, leveraging the simplicity of the refactored logic
  return {
    sender,
    nonce,
    initCode,
    callData,
    accountGasLimits: packedValues.accountGasLimits,
    preVerificationGas,
    gasFees: packedValues.gasFees,
    paymasterAndData,
    signature,
  };
}

// define mode and exec type enums
export const CALLTYPE_SINGLE = "0x00"; // 1 byte
export const CALLTYPE_BATCH = "0x01"; // 1 byte
export const EXECTYPE_DEFAULT = "0x00"; // 1 byte
export const EXECTYPE_TRY = "0x01"; // 1 byte
export const EXECTYPE_DELEGATE = "0xFF"; // 1 byte
export const MODE_DEFAULT = "0x00000000"; // 4 bytes
export const UNUSED = "0x00000000"; // 4 bytes
export const MODE_PAYLOAD = "0x00000000000000000000000000000000000000000000"; // 22 bytes
export const ERC1271_MAGICVALUE = "0x1626ba7e";
export const ERC1271_INVALID = "0xffffffff";

export const GENERIC_FALLBACK_SELECTOR = "0xcb5baf0f";

export const mode = concat([
  CALLTYPE_SINGLE,
  EXECTYPE_DEFAULT,
  UNUSED,
  MODE_DEFAULT,
  MODE_PAYLOAD,
]);

const { ethers } = require("ethers");

export const constructSessionData = (
  sessionKey,
  token,
  funcSelector,
  spendingLimit,
  validAfter,
  validUntil,
) => {
  // Ensure all inputs are in the correct format
  const sessionKeyAddress = getAddress(sessionKey);
  const tokenAddress = getAddress(token);
  const spendingLimitBN = getBigInt(spendingLimit);
  const validAfterBN = getBigInt(validAfter);
  const validUntilBN = getBigInt(validUntil);

  // Construct the _sessionData
  const sessionData = ethers.concat([
    sessionKeyAddress,
    tokenAddress,
    funcSelector,
    zeroPadValue(toBeHex(spendingLimitBN), 32),
    zeroPadValue(toBeHex(validAfterBN), 6),
    zeroPadValue(ethers.toBeHex(validUntilBN), 6),
  ]);

  return sessionData;
};
