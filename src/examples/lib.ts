
import {
    Library,
    LibraryDownloads,
} from '../index'

import { resolve } from 'path'

import {
    readJson,
} from 'fs-extra'

const lib_1 = Library.from({ name: 'com.mojang:patchy:1.1' })
console.log(lib_1)

const lib_2_path = resolve('mock', 'libraries', 'org', 'lwjgl', 'lwjgl-openal', '3.2.2', 'lwjgl-openal-3.2.2.json')
readJson(lib_2_path).then(lib_2_json => {
    const lib_2 = Library.from(lib_2_json)
    console.log(lib_2)
    console.log(lib_2.downloads.classifiers)
}).catch(err => {
    console.error(err)
})
