// utils.js

import { Keyring } from '@polkadot/keyring';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { hexToString, stringToHex } from '@polkadot/util';
import { decodeAddress, blake2AsHex } from '@polkadot/util-crypto';


// Funktion zum Generieren eines Schlüsselpaares
export const generateKeyPair = (seed) => {
  const keyring = new Keyring({ type: 'sr25519' });
  return keyring.addFromUri(seed);
};

// Funktion zum Erstellen einer Instanz des peaq API-Clients
export const createApiInstance = async (endpoint) => {
  const provider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider });
  return api;
};

const NETWORK = 'wss://wsspc1-qa.agung.peaq.network';


export const makeExtrinsicCall = async (module, call, params, keyPair) => {
  const api = await createApiInstance(NETWORK);
  const tx = api.tx[module][call](...params);

  return new Promise(async (res, rej) => {
    await tx.signAndSend(keyPair, ({ status, events }) => {
      console.log(JSON.stringify(status));
      if (status.isInBlock) {
        console.log(`Included in block with hash ${status.asInBlock.toHex()}`);
      }
      if (status.isFinalized) {
        console.log(`Finalized block hash ${status.asFinalized.toHex()}`);
        res();
      }
    }).catch(rej);
  });
};


export const getStorage = async (address, itemType) => {
  const api = await createApiInstance(NETWORK);
  const storageKey = createStorageKey(address, itemType);
  const data = await api.query.peaqStorage.itemStore(storageKey);
  console.log(JSON.stringify(data));
  return data.isSome ? data.unwrap().toHex() : null;
};

function createStorageKey(address, itemType) {
  const addressBytes = decodeAddress(address);
  const itemTypeBytes = new TextEncoder().encode(itemType);
  const combined = new Uint8Array([...addressBytes, ...itemTypeBytes]);
  const storageKey = blake2AsHex(combined.slice(0, 32));
  return storageKey;
}