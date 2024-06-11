import { Sdk } from "@peaq-network/sdk";
import { mnemonicGenerate, cryptoWaitReady } from "@polkadot/util-crypto";

const generateMnemonicSeed = () => {
  return mnemonicGenerate();
};

const createSDKInstance = async () => {
  const mnemonicSeed = generateMnemonicSeed();
  await cryptoWaitReady();
  const sdkInstance = await Sdk.createInstance({
    baseUrl: "wss://wsspc1-qa.agung.peaq.network",
    seed: mnemonicSeed,
  });
  return sdkInstance;
};

const connectToPeaq = async () => {
  const sdkInstance = await createSDKInstance();
  await sdkInstance.connect();
  return sdkInstance;
};

connectToPeaq();
