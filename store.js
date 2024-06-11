import fs from "fs/promises";
import { generateKeyPair, makeExtrinsicCall, getStorage } from "./utils.js";
import { hexToU8a, u8aToHex, u8aToString, stringToHex, stringToU8a } from '@polkadot/util';
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { decodeAddress, blake2AsHex } from '@polkadot/util-crypto';


const ITEM_TYPE = 'XYZ';


const store = async () => {
  await cryptoWaitReady();
  const seeds = JSON.parse(await fs.readFile("seeds.json", "utf8"));
  const machineSeed = seeds.owner;
  const machineKeypair = generateKeyPair(machineSeed);
  const data = "HOFA";
  const dataHex = u8aToHex(stringToU8a(data));

  console.log('u8a: ', stringToU8a(data));
  console.log('dataHex: ', dataHex);

  const signature = u8aToHex(machineKeypair.sign(hexToU8a(dataHex)));

  console.log('Address: ', machineKeypair.address);
  console.log('Signature: ', signature);

  const payload = {
    data: dataHex,
    signature: signature,
  };

  // Serialize payload into hex format for storage
  const payloadHex = u8aToHex(stringToU8a(JSON.stringify(payload)));

  await makeExtrinsicCall(
    "peaqStorage",
    "addItem",
    [ITEM_TYPE, payloadHex],
    machineKeypair
  );
 

  console.log('try loading data...');
  const retrievedDataHex = await getStorage(machineKeypair.address, ITEM_TYPE);
  console.log('Data HEX:', retrievedDataHex);

  if (!retrievedDataHex) {
    console.log('No data retrieved');
    return;
  }

  const retrievedDataU8a = hexToU8a(retrievedDataHex);
  console.log('U8a data: ', retrievedDataU8a);
  
  const retrievedDataString = u8aToString(retrievedDataU8a);
  console.log('retrievedDataString: ', retrievedDataString);

  const parsed = JSON.parse(retrievedDataString);
  console.log('parsed Data:', parsed);

  const originalData = u8aToString(hexToU8a(parsed.data));
  console.log('Original Data:', originalData)

};

store();
