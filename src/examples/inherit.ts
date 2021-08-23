
import { config } from 'dotenv';
config();

const {
    PARENT_VERSION_ID: parentId,
    MODDED_VERSION_ID: moddedId,
} = process.env;

import { readJson } from '../util';

import {
    resolve,
    join,
} from 'path';

import { Version, IVersion } from '../index';

(async () => {
    const directory = resolve('mock', 'versions');

    if (!parentId) throw new Error('parent id is undefined');
    if (!moddedId) throw new Error('modded id is undefined');

    const parent: Partial<IVersion> = await readJson(join(directory, parentId, parentId + '.json'));
    console.log(parent);

    const modded: Partial<IVersion> = await readJson(join(directory, moddedId, moddedId + '.json'));
    console.log(modded);

    const result = Version.from(modded, parent);
    console.log(result);
})().catch(err => console.error(err));
