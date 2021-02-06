
import { readJson } from 'fs-extra'

import {
    resolve,
    join,
} from 'path'

import {
    Version,
} from '../index'

(async () => {
    const directory = resolve('mock', 'versions')

    const parentId = '1.14.4'
    const parent = await readJson(join(directory, parentId, parentId + '.json'))
    console.log(parent)

    const moddedId = '1.14.4-forge-28.0.47'
    const modded = await readJson(join(directory, moddedId, moddedId + '.json'))
    console.log(modded)

    const result = Version.from(modded, parent)
    console.log(result)
})().catch(err => console.error(err))
