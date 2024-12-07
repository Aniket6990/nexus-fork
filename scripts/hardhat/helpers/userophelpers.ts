import {
  AddressLike,
  BigNumberish,
  BytesLike,
  concat,
  dataSlice,
  getAddress,
  getBigInt,
  getBytes,
  hexlify,
  solidityPacked,
  toBeHex,
  ZeroAddress,
  zeroPadValue,
} from "ethers";
import { PackedUserOperation, UserOperation } from "./types";
import { toGwei } from "./encoding";
import { EntryPoint, Nexus } from "../../../typechain-types";

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
export const MODE_VALIDATION = "0x00";
export const MODE_MODULE_ENABLE = "0x01";

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

function makeNonceKey(
  vMode: BytesLike,
  validator: AddressLike,
  batchId: BytesLike,
): string {
  // Convert the validator address to a Uint8Array
  const validatorBytes = getBytes(getAddress(validator.toString()));

  // Prepare the validation mode as a 1-byte Uint8Array
  const validationModeBytes = Uint8Array.from([Number(vMode)]);

  // Convert the batchId to a Uint8Array (assuming it's 3 bytes)
  const batchIdBytes = getBytes(batchId);

  // Create a 24-byte array for the 192-bit key
  const keyBytes = new Uint8Array(24);

  // Set the batchId in the most significant 3 bytes (positions 0, 1, and 2)
  keyBytes.set(batchIdBytes, 0);

  // Set the validation mode at the 4th byte (position 3)
  keyBytes.set(validationModeBytes, 3);

  // Set the validator address starting from the 5th byte (position 4)
  keyBytes.set(validatorBytes, 4);

  // Return the key as a hex string
  return hexlify(keyBytes);
}

// Adjusted getNonce function
export async function getNonce(
  entryPoint: EntryPoint,
  accountAddress: AddressLike,
  validationMode: BytesLike,
  validatorModuleAddress: AddressLike,
  batchId: BytesLike = "0x000000",
): Promise<bigint> {
  const key = makeNonceKey(validationMode, validatorModuleAddress, batchId);
  return await entryPoint.getNonce(accountAddress, key);
}

export function numberTo3Bytes(num: number): string {
  if (num < 0 || num > 0xffffff) {
    throw new Error(
      "Number out of range. Must be between 0 and 16777215 inclusive.",
    );
  }
  return "0x" + num.toString(16).padStart(6, "0");
}

export async function getAccountDomainStructFields(
  account: Nexus,
): Promise<string> {
  const [fields, name, version, chainId, verifyingContract, salt, extensions] =
    await account.eip712Domain();
  return ethers.AbiCoder.defaultAbiCoder().encode(
    [
      "bytes1",
      "bytes32",
      "bytes32",
      "uint256",
      "address",
      "bytes32",
      "bytes32",
    ],
    [
      fields, // matches Solidity
      ethers.keccak256(ethers.toUtf8Bytes(name)), // matches Solidity
      ethers.keccak256(ethers.toUtf8Bytes(version)), // matches Solidity
      chainId,
      verifyingContract,
      salt,
      ethers.keccak256(ethers.solidityPacked(["uint256[]"], [extensions])),
    ],
  );
}
