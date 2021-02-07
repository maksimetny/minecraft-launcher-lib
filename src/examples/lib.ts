
import { resolve } from 'path'

import {
    Library,
    LibraryDownloads,
} from '../index'

import {
    readJson,
} from 'fs-extra'

(async () => {
    const minLib = Library.from({ name: 'com.mojang:patchy:1.1' })
    console.log(minLib)

    const libPath = resolve('mock', 'libraries', 'org', 'lwjgl', 'lwjgl-openal', '3.2.2', 'lwjgl-openal-3.2.2.json')
    const lib = Library.from(await readJson(libPath))
    console.log(lib)
    console.log(lib.downloads.classifiers)
})().catch(err => console.error(err))
