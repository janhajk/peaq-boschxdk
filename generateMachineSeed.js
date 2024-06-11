import fs from 'fs/promises';
import { mnemonicGenerate } from '@polkadot/util-crypto';

const generateMachineSeed = () => {
  return mnemonicGenerate();
};

const updateSeedsFile = async () => {
  try {
    // Datei lesen
    const data = await fs.readFile('seeds.json', 'utf8');
    const seeds = JSON.parse(data);

    // Prüfen, ob der Machine-Seed bereits existiert
    if (!seeds.machine) {
      const machineSeed = generateMachineSeed();
      seeds.machine = machineSeed;

      // seeds.json-Datei aktualisieren
      await fs.writeFile('seeds.json', JSON.stringify(seeds, null, 2));
      console.log('seeds.json file has been updated with new machine seed.');
    } else {
      console.log('Machine seed already exists in seeds.json.');
    }
  } catch (error) {
    console.error('Error reading or updating seeds.json:', error);
  }
};

// Skript ausführen
updateSeedsFile();
