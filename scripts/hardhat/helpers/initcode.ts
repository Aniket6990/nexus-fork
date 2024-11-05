import { concat, JsonRpcProvider } from "ethers";
import { NexusAccountFactory__factory } from "../../../typechain-types";

export const generateInitCode = (
  factoryAddress: string,
  initData: string,
  salt: string,
  provider: JsonRpcProvider,
) => {
  const nexusFactory = NexusAccountFactory__factory.connect(
    factoryAddress,
    provider,
  );
  const data = nexusFactory.interface.encodeFunctionData("createAccount", [
    initData,
    salt,
  ]);

  return concat([factoryAddress, data]);
};
