import { Sdk } from "@peaq-network/sdk";
import Keyring from "@polkadot/keyring";
import fs from "fs/promises";

const register = async () => {
  const seeds = JSON.parse(await fs.readFile("seeds.json", "utf8"));
  const ownerSeed = seeds.owner;
  const machineSeed = seeds.machine;

  const sdkInstance = await Sdk.createInstance({
    baseUrl: "wss://wsspc1-qa.agung.peaq.network",
    seed: ownerSeed,
  });

  const keyring = new Keyring({ type: "sr25519" });
  const machinePair = keyring.addFromUri(machineSeed);

  // Register the machine's DID
  await sdkInstance.did.create(
    { name: `did:peaq:${machinePair.address}`, address: machinePair.address },
    (result) => {
      console.log(result);
    }
  );
};

register();
