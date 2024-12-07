import {
  JsonRpcProvider,
  Wallet,
  ContractFactory,
  keccak256,
  solidityPacked,
  getBytes,
  concat,
  toBeHex,
  zeroPadBytes,
  parseEther,
  AbiCoder,
} from "ethers";
import "dotenv/config";
import {
  Nexus__factory,
  NexusAccountFactory__factory,
  BootstrapLib,
  NexusBootstrap,
  BootstrapLib__factory,
  NexusBootstrap__factory,
  EntryPoint__factory,
  MockToken__factory,
  SigValidator__factory,
  DelegatorValidator__factory,
  MockRegistry__factory,
} from "../../typechain-types";
import { zeroAddress } from "viem";
import { generateInitCode } from "./helpers/initcode";
import {
  buildPackedUserOp,
  constructSessionData,
  getAccountDomainStructFields,
  getNonce,
  mode,
  MODE_MODULE_ENABLE,
  numberTo3Bytes,
} from "./helpers/userophelpers";
import { to18 } from "./helpers/encoding";
import { abi, bytecode } from "./abi/delegatorABI";

const deployImplementationAndFactory = async () => {
  // const RPC_URL = process.env.API_KEY_ALCHEMY;
  // const PVT_KEY = process.env.PVT_KEY;
  const RPC_URL = "http://127.0.0.1:8545";
  const PVT_KEY =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  // const ENTRYPOINT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";

  // console.log(`Entrypoint address: ${ENTRYPOINT_ADDRESS}`);
  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = await provider.getSigner(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  );
  const ownerAddress = wallet.address;
  console.log(`owmer address: ${ownerAddress}`);

  const entryPoint = new ContractFactory(
    EntryPoint__factory.abi,
    EntryPoint__factory.bytecode,
    wallet,
  );
  const entrypointDeploy = await entryPoint.deploy();
  entrypointDeploy.waitForDeployment();
  console.log("Entrypoint deployed at: ", entrypointDeploy.target);
  // implementation deployment
  const nexus = new ContractFactory(
    Nexus__factory.abi,
    Nexus__factory.bytecode,
    wallet,
  );
  const nexusDeploy = await nexus.deploy(entrypointDeploy.target);
  nexusDeploy.waitForDeployment();
  console.log(`nexus implementation is deployed at: ${nexusDeploy.target}`);

  // factory deployment
  const nexusFactory = new ContractFactory(
    NexusAccountFactory__factory.abi,
    NexusAccountFactory__factory.bytecode,
    wallet,
  );
  const factoryDeploy = await nexusFactory.deploy(
    nexusDeploy.target,
    ownerAddress,
  );
  factoryDeploy.waitForDeployment();
  console.log(`nexus factory deployed at: ${factoryDeploy.target}`);

  const bootStrapLib = new ContractFactory(
    BootstrapLib__factory.abi,
    BootstrapLib__factory.bytecode,
    wallet,
  );
  const libDeploy = await bootStrapLib.deploy();
  libDeploy.waitForDeployment();
  console.log(`BootstrapLib is deployed at: ${libDeploy.target}`);

  const bootStrap = new ContractFactory(
    NexusBootstrap__factory.abi,
    NexusBootstrap__factory.bytecode,
    wallet,
  );
  const bootStrapDeploy = await bootStrap.deploy();
  bootStrapDeploy.waitForDeployment();
  console.log(`Bootstrap is deployed at: ${bootStrapDeploy.target}`);

  const token = new ContractFactory(
    MockToken__factory.abi,
    MockToken__factory.bytecode,
    wallet,
  );
  const tokenDeploy = await token.deploy("MockToken", "MTK");
  tokenDeploy.waitForDeployment();
  console.log(`token deployed at: ${tokenDeploy.target}`);

  const sigValidator = new ContractFactory(
    SigValidator__factory.abi,
    SigValidator__factory.bytecode,
    wallet,
  );

  const sigValidatorDeploy = await sigValidator.deploy();
  sigValidatorDeploy.waitForDeployment();
  console.log(`sigValidator deployed at: ${sigValidatorDeploy.target}`);

  const delegationModule = new ContractFactory(
    DelegatorValidator__factory.abi,
    DelegatorValidator__factory.bytecode,
    wallet,
  );
  const delegatorDeploy = await delegationModule.deploy();
  delegatorDeploy.waitForDeployment();
  console.log(`Delegator deployed at:${delegatorDeploy.target}`);

  const mockRegistry = new ContractFactory(
    MockRegistry__factory.abi,
    MockRegistry__factory.bytecode,
    wallet,
  );
  const registryDeploy = await mockRegistry.deploy();
  registryDeploy.waitForDeployment();
  console.log(`Registry deployed at: ${registryDeploy.target}`);
};

// Entrypoint address: 0x0000000071727De22E5E9d8BAf0edAc6f37da032
// owmer address: 0xEBFa37194fA74bA3e8195446948FC3B9c72E08AB
// nexus implementation is deployed at: 0x662240cA7799464e8223EcBDC2963D7bDb76c912
// nexus factory deployed at: 0x68B3d54D20Ee83Da761a6dF03166520E91daf14c
// BootstrapLib is deployed at: 0x5617469Da63fB66CFFf8000FA4b9F97e9706b0c8
// Bootstrap is deployed at: 0x609Ff2ab292137acd94713DD97EB74A509741575

const main = async () => {
  const RPC_URL = "http://127.0.0.1:8545";
  const PVT_KEY =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const ENTRYPOINT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  // console.log(`Entrypoint address: ${ENTRYPOINT_ADDRESS}`);
  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = await provider.getSigner(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  );
  const ownerAddress = wallet.address;
  console.log(`owmer address: ${ownerAddress}`);
  const nexusAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const nexusFactoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const bootStrapLibAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const bootStrapAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const ecdsaValidatorAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const erc20ValidationAddress = "0x1417aDC5308a32265E0fA0690ea1408FFA62F37c";
  const tokenAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const receiverAddress = "0xb5753d1cb0de1042ff76e50e2ba50e79fef8ff71";
  const registryAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

  console.log(`nexus implementation address: ${nexusAddress}`);
  console.log(`nexus factory address: ${nexusFactoryAddress}`);
  console.log(`BootstrapLib address: ${bootStrapLibAddress}`);
  console.log(`Bootstrap address: ${bootStrapAddress}`);

  const entryPoint = EntryPoint__factory.connect(ENTRYPOINT_ADDRESS, wallet);
  const lib = BootstrapLib__factory.connect(bootStrapLibAddress, wallet);
  const bootStrap = NexusBootstrap__factory.connect(bootStrapAddress, wallet);
  const nexusAccountFactory = NexusAccountFactory__factory.connect(
    nexusFactoryAddress,
    wallet,
  );

  const ecdsaValidator = await lib.createSingleConfig(
    ecdsaValidatorAddress,
    solidityPacked(["address"], [ownerAddress]),
  );

  const parsedValidator1 = {
    module: ecdsaValidator[0],
    data: ecdsaValidator[1],
  };

  const salt = keccak256("0x00");
  const initData = await bootStrap.getInitNexusWithSingleValidatorCalldata(
    parsedValidator1,
    registryAddress,
    [],
    0,
  );
  console.log(`initData: ${initData}`);

  const accountAddress = await nexusAccountFactory.computeAccountAddress(
    initData,
    salt,
  );
  const account = await Nexus__factory.connect(accountAddress, wallet);
  console.log(`computed account address: ${accountAddress}`);

  const initCode = generateInitCode(
    nexusFactoryAddress,
    initData,
    salt,
    provider,
  );

  const nexus = Nexus__factory.connect(accountAddress, wallet);

  const erc = MockToken__factory.connect(tokenAddress, wallet);

  console.log("approving token..");
  const res = await erc.approve(accountAddress, BigInt(100));

  await res.wait();

  console.log("token approved...");

  const allowence = await erc.allowance(ownerAddress, accountAddress);

  console.log(`approved amount: ${allowence.toString()}`);
  const functionData = erc.interface.encodeFunctionData("transferFrom", [
    ownerAddress,
    receiverAddress,
    BigInt(100000000000000000000000000),
  ]);
  const callData = nexus.interface.encodeFunctionData("execute", [
    mode,
    solidityPacked(
      ["address", "uint256", "bytes"],
      [tokenAddress, 0, functionData],
    ),
  ]);

  const nonce = await getNonce(
    entryPoint,
    accountAddress,
    MODE_MODULE_ENABLE,
    ecdsaValidatorAddress,
    numberTo3Bytes(0),
  );

  console.log(`nonce: ${nonce}`);

  const op = buildPackedUserOp({
    sender: accountAddress,
    initCode: initCode,
    callData: callData,
    nonce: toBeHex(nonce),
  });

  const userOpHash = await entryPoint.getUserOpHash(op);
  console.log(`useropHash: ${userOpHash}`);
  const signature = await wallet.signMessage(getBytes(userOpHash));
  op.signature = signature;

  console.log(op);

  console.log("depositing");
  const txn = await entryPoint.depositTo(accountAddress, {
    value: parseEther("2"),
  });
  await txn.wait();
  console.log("deposited");

  const eip712Digest = await getAccountDomainStructFields(account);

  const eip712Signed = await wallet.signMessage(eip712Digest);

  const signatureWithDigest = concat([
    ecdsaValidatorAddress,
    "0x01",
    initData,
    eip712Signed,
    signature,
  ]);
  op.signature = signature;

  const res2 = await entryPoint.handleOps(
    [op],
    "0xEBFa37194fA74bA3e8195446948FC3B9c72E08AB",
  );
  await res2.wait();
};

// const installDelegationModule = async () => {
//   const RPC_URL = process.env.API_KEY_ALCHEMY;
//   const PVT_KEY = process.env.PVT_KEY;
//   const ENTRYPOINT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
//   // const ENTRYPOINT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

//   console.log(`Entrypoint address: ${ENTRYPOINT_ADDRESS}`);
//   const provider = new JsonRpcProvider(RPC_URL);
//   // const wallet = await provider.getSigner(
//   //   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//   // );
//   const wallet = new Wallet(PVT_KEY, provider);
//   const ownerAddress = wallet.address;
//   console.log(`owmer address: ${ownerAddress}`);
//   const smartAccountAddress = "0xeCD20bdA26B6DFE23Ec7eb04318E219BfD91b1B9";
//   const erc20ValidationAddress = "0xB48E585Feed020b41464C0C70712513BD7C37468";
//   const ecdsaValidatorAddress = "0xA4A49b375ab4D59BBB5A978a4525356d57925d51";

//   const entryPoint = EntryPoint__factory.connect(ENTRYPOINT_ADDRESS, wallet);
//   const nexus = Nexus__factory.connect(smartAccountAddress, wallet);

//   const installModuleData = nexus.interface.encodeFunctionData(
//     "installModule",
//     [1, erc20ValidationAddress, "0x"],
//   );

//   const callData = nexus.interface.encodeFunctionData("execute", [
//     mode,
//     solidityPacked(
//       ["address", "uint256", "bytes"],
//       [smartAccountAddress, 0, installModuleData],
//     ),
//   ]);

//   const nonce = await entryPoint.getNonce(
//     smartAccountAddress,
//     zeroPadBytes(ecdsaValidatorAddress, 24),
//   );

//   console.log(`nonce: ${nonce}`);

//   const op = buildPackedUserOp({
//     sender: smartAccountAddress,
//     initCode: "0x",
//     callData: callData,
//     nonce: toBeHex(nonce),
//   });

//   const userOpHash = await entryPoint.getUserOpHash(op);
//   console.log(`useropHash: ${userOpHash}`);
//   const signature = await wallet.signMessage(getBytes(userOpHash));
//   op.signature = signature;

//   console.log(op);

//   console.log("depositing");
//   const txn = await entryPoint.depositTo(smartAccountAddress, {
//     value: parseEther("1"),
//   });
//   await txn.wait();
//   console.log("deposited");

//   const res2 = await entryPoint.handleOps(
//     [op],
//     "0xEBFa37194fA74bA3e8195446948FC3B9c72E08AB",
//   );
//   await res2.wait();
//   console.log(`installed module successfully: ${res2.hash}`);
// };

// const createDelegator = async () => {
//   const RPC_URL = process.env.API_KEY_ALCHEMY;
//   const PVT_KEY = process.env.PVT_KEY;
//   const ENTRYPOINT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
//   // const ENTRYPOINT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

//   console.log(`Entrypoint address: ${ENTRYPOINT_ADDRESS}`);
//   const provider = new JsonRpcProvider(RPC_URL);
//   // const wallet = await provider.getSigner(
//   //   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//   // );
//   const wallet = new Wallet(PVT_KEY, provider);
//   const delegator = new Wallet(
//     "10ccc3a433cd7c5f8ce5fa391f166efc215210f23a00037ff0db489a9f7a6806",
//     provider,
//   );
//   const ownerAddress = wallet.address;
//   console.log(`owmer address: ${ownerAddress}`);
//   const delegatorAddress = "0x73bE4EC18559C4B9E3db9aECC10db18cc6f42840";
//   console.log(`Delegator address: ${delegatorAddress}`);
//   const smartAccountAddress = "0xeCD20bdA26B6DFE23Ec7eb04318E219BfD91b1B9";
//   const erc20ValidationAddress = "0xB48E585Feed020b41464C0C70712513BD7C37468";
//   const ecdsaValidatorAddress = "0xA4A49b375ab4D59BBB5A978a4525356d57925d51";
//   const tokenAddress = "0x400B4C0D90a43b06b9d8d38b6DB4694ACbEC1031";

//   const entryPoint = EntryPoint__factory.connect(ENTRYPOINT_ADDRESS, wallet);
//   const nexus = Nexus__factory.connect(smartAccountAddress, wallet);

//   const erc20Validator = new ContractFactory(abi, bytecode, wallet);

//   const sessionData = constructSessionData(
//     delegatorAddress,
//     tokenAddress,
//     "0xa9059cbb",
//     100,
//     Math.floor(Date.now() / 1000),
//     Math.floor(Date.now() / 1000 + 604800),
//   );

//   console.log(`sessionData: ${sessionData}`);
//   const enableSessionKey = erc20Validator.interface.encodeFunctionData(
//     "enableSessionKey",
//     [sessionData],
//   );

//   const callData = nexus.interface.encodeFunctionData("execute", [
//     mode,
//     solidityPacked(
//       ["address", "uint256", "bytes"],
//       [erc20ValidationAddress, 0, enableSessionKey],
//     ),
//   ]);

//   const nonce = await entryPoint.getNonce(
//     smartAccountAddress,
//     zeroPadBytes(ecdsaValidatorAddress, 24),
//   );

//   console.log(`nonce: ${nonce}`);

//   const op = buildPackedUserOp({
//     sender: smartAccountAddress,
//     initCode: "0x",
//     callData: callData,
//     nonce: toBeHex(nonce),
//   });

//   const userOpHash = await entryPoint.getUserOpHash(op);
//   console.log(`useropHash: ${userOpHash}`);
//   const signature = await wallet.signMessage(getBytes(userOpHash));
//   op.signature = signature;

//   console.log(op);

//   // console.log("depositing");
//   // const txn = await entryPoint.depositTo(smartAccountAddress, {
//   //   value: parseEther("1"),
//   // });
//   // await txn.wait();
//   // console.log("deposited");

//   const res2 = await entryPoint.handleOps(
//     [op],
//     "0xEBFa37194fA74bA3e8195446948FC3B9c72E08AB",
//   );
//   await res2.wait();
//   console.log(`delegator enabled successfully: ${res2.hash}`);
// };

// const sendDelegatorTransaction = async () => {
//   const RPC_URL = process.env.API_KEY_ALCHEMY;
//   const PVT_KEY = process.env.PVT_KEY;
//   const ENTRYPOINT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
//   // const ENTRYPOINT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

//   console.log(`Entrypoint address: ${ENTRYPOINT_ADDRESS}`);
//   const provider = new JsonRpcProvider(RPC_URL);
//   // const wallet = await provider.getSigner(
//   //   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//   // );
//   const wallet = new Wallet(PVT_KEY, provider);
//   const delegator = new Wallet(
//     "10ccc3a433cd7c5f8ce5fa391f166efc215210f23a00037ff0db489a9f7a6806",
//     provider,
//   );
//   const ownerAddress = wallet.address;
//   console.log(`owmer address: ${ownerAddress}`);
//   const delegatorAddress = "0x73bE4EC18559C4B9E3db9aECC10db18cc6f42840";
//   console.log(`Delegator address: ${delegatorAddress}`);
//   const smartAccountAddress = "0xeCD20bdA26B6DFE23Ec7eb04318E219BfD91b1B9";
//   const erc20ValidationAddress = "0xB48E585Feed020b41464C0C70712513BD7C37468";
//   const ecdsaValidatorAddress = "0xA4A49b375ab4D59BBB5A978a4525356d57925d51";
//   const tokenAddress = "0x400B4C0D90a43b06b9d8d38b6DB4694ACbEC1031";

//   const entryPoint = EntryPoint__factory.connect(ENTRYPOINT_ADDRESS, wallet);
//   const nexus = Nexus__factory.connect(smartAccountAddress, wallet);

//   const erc20Validator = new ContractFactory(abi, bytecode, wallet);

//   const MockToken = MockToken__factory.connect(tokenAddress, wallet);
//   const transferData = MockToken.interface.encodeFunctionData("transfer", [
//     "0xEBFa37194fA74bA3e8195446948FC3B9c72E08AB",
//     100,
//   ]);

//   const callData = nexus.interface.encodeFunctionData("execute", [
//     mode,
//     solidityPacked(
//       ["address", "uint256", "bytes"],
//       [tokenAddress, 0, transferData],
//     ),
//   ]);

//   const nonce = await entryPoint.getNonce(
//     smartAccountAddress,
//     zeroPadBytes(erc20ValidationAddress, 24),
//   );

//   console.log(`nonce: ${nonce}`);

//   const op = buildPackedUserOp({
//     sender: smartAccountAddress,
//     initCode: "0x",
//     callData: callData,
//     nonce: toBeHex(nonce),
//   });

//   const userOpHash = await entryPoint.getUserOpHash(op);
//   console.log(`useropHash: ${userOpHash}`);
//   const signature = await delegator.signMessage(getBytes(userOpHash));
//   op.signature = signature;

//   console.log(op);

//   // console.log("depositing");
//   // const txn = await entryPoint.depositTo(smartAccountAddress, {
//   //   value: parseEther("1"),
//   // });
//   // await txn.wait();
//   // console.log("deposited");

//   const res2 = await entryPoint.handleOps(
//     [op],
//     "0xEBFa37194fA74bA3e8195446948FC3B9c72E08AB",
//   );
//   await res2.wait();
//   console.log(`Token sent: ${res2.hash}`);
// };

deployImplementationAndFactory();
// main();
// installDelegationModule();
// createDelegator();
// sendDelegatorTransaction();
