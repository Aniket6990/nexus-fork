import { JsonRpcProvider, parseEther, Wallet } from "ethers";

const main = async () => {
  const provider = new JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider,
  );

  const txn = await wallet.sendTransaction({
    to: "0xEBFa37194fA74bA3e8195446948FC3B9c72E08AB",
    value: parseEther("100"),
  });
  await txn.wait();
  console.log(`sent 100 ETH `);
};
main();
