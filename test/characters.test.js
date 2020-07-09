import fs from 'fs';
import { assert } from 'chai';
import nodejsmq from 'nodejsmq';
import { colors, names } from '../src/lib/players';

const nodeMQ = nodejsmq(process.env.RABBITMQ);
const characters = [];

describe('simple tests', () => {
  before(() => nodeMQ.publishMessage('dbapi', {
    model: 'character',
    method: 'find',
    methodData: { game: 'ultimate' },
  }).then((response) => {
    for (const character of response.results) {
      characters.push(character);
    }
  }));

  it('colors have all characters', () => {
    const dbcodes = characters.map((c) => c.code);
    const colorCodes = Object.keys(colors);

    for (const code of dbcodes) {
      assert.include(colorCodes, code);
    }
  });

  it('names have all characters', () => {
    const dbcodes = characters.map((c) => c.code);
    const nameCodes = Object.keys(names);

    for (const code of dbcodes) {
      assert.include(nameCodes, code);
    }
  });

  it('image assets should cover all characters', () => {
    const dbcodes = characters.map((c) => c.code);
    const folders = ['emblem', 'full', 'head', 'portraits', 'thumb_h', 'thumb_v'];
    const exts = ['svg', 'png', 'png', 'png', 'png', 'png'];

    for (const [i, folder] of folders.entries()) {
      const asset = `${__dirname}/../src/img/assets/${folder}`;
      const ext = exts[i];

      for (const code of dbcodes) {
        const image = `${asset}/${code}.${ext}`;
        const exists = fs.existsSync(image);
        if (!exists) {
          console.log(`folder: ${folder} is missing ${code}`);
        }
        assert.isTrue(exists);
      }
    }
  });
});
