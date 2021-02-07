
import { OS } from '../platform'
import { Action } from '../rule'
import { LibraryDownloads } from './downloads'

import {
    resolve,
    join,
} from 'path'

import { readJson } from 'fs-extra'

import {
    Library,
} from './library'

describe('Library', () => {

    describe('#from', () => {

        it('should be able to resolve normal library', () => {
            const lib = Library.from({
                downloads: {
                    artifact: {
                        path: 'com/mojang/patchy/1.1/patchy-1.1.jar',
                        url: 'https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar',
                        sha1: 'aef610b34a1be37fa851825f12372b78424d8903',
                    },
                    classifiers: {
                        // when parsing from json this will not be
                    },
                },
                name: 'com.mojang:patchy:1.1',
            })

            {
                const {
                    path,
                    url,
                    sha1,
                } = lib.downloads.artifact

                expect(path).toBe('com/mojang/patchy/1.1/patchy-1.1.jar')
                expect(url).toBe('https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar')
                expect(sha1).toBe('aef610b34a1be37fa851825f12372b78424d8903')
            } // expect artifact

            expect(lib.name).toBe('com.mojang:patchy:1.1')
        })

        it('should be able to resolve minimum library', () => {
            const lib = Library.from({ name: 'com.mojang:patchy:1.1' })

            expect(lib.name).toBe('com.mojang:patchy:1.1')

            {
                const {
                    artifact,
                } = lib.downloads

                expect(artifact.path).toBe('com/mojang/patchy/1.1/patchy-1.1.jar')
                expect(artifact.url).toBe('https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar')
            } // expect artifact
        })

        it('should be able to resolve strange library without downloads', async () => {
            const libraryJsonPath = resolve('mock', 'libraries', 'org', 'lwjgl', 'lwjgl-openal', '3.2.2', 'lwjgl-openal-3.2.2.json')
            const lib = Library.from(await readJson(libraryJsonPath))

            {
                const {
                    [lib.natives.windows]: onWindows,
                    [lib.natives.linux]: onLinux,
                } = lib.downloads.classifiers

                expect(onWindows.path).toBe('org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-windows.jar')
                expect(onWindows.url).toBe('https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-windows.jar')

                expect(onLinux.path).toBe('org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-linux.jar')
                expect(onLinux.url).toBe('https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-linux.jar')
            } // expect classifiers

            {
                const {
                    artifact,
                } = lib.downloads

                expect(artifact.path).toBe('org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.jar')
                expect(artifact.url).toBe('https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.jar')
            } // expect artifact
        })

        it('should be able to resolve forge library', () => {
            const lib = Library.from({
                downloads: {
                    artifact: {
                        path: 'net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar',
                        url: 'https://modloaders.forgecdn.net/647622546/maven/net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar',
                        sha1: 'afe6f0d2a5341dfbc3c225208ce64d5684ece8f1',
                    },
                    classifiers: {
                        // when parsing from json this will not be
                    },
                },
                name: 'net.minecraftforge:forge:1.14.4-28.2.0',
            })

            {
                const {
                    path,
                    url,
                    sha1,
                } = lib.downloads.artifact

                expect(path).toBe('net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar')
                expect(url).toBe('https://modloaders.forgecdn.net/647622546/maven/net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar')
                expect(sha1).toBe('afe6f0d2a5341dfbc3c225208ce64d5684ece8f1')
            } // expect artifact

            expect(lib.name).toBe('net.minecraftforge:forge:1.14.4-28.2.0')
        })

    })

})
