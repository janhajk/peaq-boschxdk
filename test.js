import { generateKeyPair, makeExtrinsicCall, getStorage } from "./utils.js";
import { hexToU8a, u8aToHex, u8aToString, stringToU8a } from "@polkadot/util";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { decodeAddress, blake2AsHex } from '@polkadot/util-crypto';
const data = "0xd0046802c035434c6f50415370574879367977483834557a484b354a44795864344a736a6370453246726854565a4173774441446d";
const retrievedDataHex = '0x35434c6f50415370574879367977483834557a484b354a44795864344a736a6370453246726854565a4173774441446d';

// console.log(hexToU8a(retrievedDataHex));
console.log(hexToU8a(data));
console.log(u8aToString(hexToU8a(data)));

console.log(hexToU8a(retrievedDataHex));
console.log(u8aToString(hexToU8a(retrievedDataHex)));

const parsed = JSON.parse(hexToU8a(retrievedDataHex).toString());
console.log('parsed Data:', parsed);
