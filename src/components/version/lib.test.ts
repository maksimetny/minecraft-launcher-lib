
import {
    Library,
    LibraryDownloads
} from './lib'

describe('Library', () => {

    describe('#resolve', () => {

        it('should be able to resolve normal library', () => {
            const _lib: any /* Partial<ILibrary> */ = {
                downloads: {
                    artifact: {
                        path: 'com/mojang/patchy/1.1/patchy-1.1.jar',
                        url: 'https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar',
                        sha1: 'aef610b34a1be37fa851825f12372b78424d8903'
                    },
                    classifiers: {
                        // when parsing from json this will not be
                    }
                },
                name: 'com.mojang:patchy:1.1'
            }

            const [lib] = Library.resolve([_lib])

            {
                const { url, path, sha1 } = lib.downloads.artifact

                expect(path).toBe(_lib.downloads.artifact.path)
                expect(url).toBe(_lib.downloads.artifact.url)
                expect(sha1).toBe(_lib.downloads.artifact.sha1)
            } // expect artifact

            expect(lib.name).toBe(_lib.name)
        })

        it('should be able to resolve minimum library', () => {
            const _lib = { name: 'com.mojang:patchy:1.1' }, [lib] = Library.resolve([_lib])

            expect(lib.name).toBe(_lib.name)

            {
                const { artifact } = lib.downloads

                expect((artifact).path).toBe('com/mojang/patchy/1.1/patchy-1.1.jar')
                expect((artifact).url).toBe('https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar')
            } // expect artifact
        })

        it('should be able to resolve strange library without downloads', () => {
            const _lib: any = {
                name: 'org.lwjgl:lwjgl-openal:3.2.2',
                natives: {
                    linux: 'natives-linux', windows: 'natives-windows'
                },
                rules: [
                    {
                        action: 'allow'
                    },
                    {
                        action: 'disallow', os: { name: 'osx' }
                    }
                ]
            }

            const [lib] = Library.resolve([_lib])

            {
                const { [lib.natives.windows]: onWindows, [lib.natives.linux]: onLinux } = lib.downloads.classifiers

                expect(onWindows.path).toBe('org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-windows.jar')
                expect(onWindows.url).toBe('https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-windows.jar')

                expect(onLinux.path).toBe('org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-linux.jar')
                expect(onLinux.url).toBe('https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-linux.jar')
            } // expect classifiers

            {
                const { artifact } = lib.downloads

                expect((artifact).path).toBe('org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.jar')
                expect((artifact).url).toBe('https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.jar')
            } // expect artifact
        })

        it('should be able to resolve forge library', () => {
            const _lib: any = {
                downloads: {
                    artifact: {
                        path: 'net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar',
                        url: 'https://modloaders.forgecdn.net/647622546/maven/net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar',
                        sha1: 'afe6f0d2a5341dfbc3c225208ce64d5684ece8f1'
                    },
                    classifiers: {
                        // when parsing from json this will not be
                    }
                },
                name: 'net.minecraftforge:forge:1.14.4-28.2.0'
            }

            const [lib] = Library.resolve([_lib])

            {
                const { url, path, sha1 } = lib.downloads.artifact

                expect(path).toBe(_lib.downloads.artifact.path)
                expect(url).toBe(_lib.downloads.artifact.url)
                expect(sha1).toBe(_lib.downloads.artifact.sha1)
            } // expect artifact

            expect(lib.name).toBe(_lib.name)
        })

    })

    // describe('#artifactFromLibraryPath', () => {

    //     it('should be able to infer from path', () => {
    //         const artifact = LibraryDownloads.artifactFromLibraryPath('org/lwjgl/lwjgl-stb/3.2.1/lwjgl-stb-3.2.1.jar')
    //     })

    //     it('should be able to infer from path with classifier', () => {
    //         //
    //     })

    // })

    describe('#artifactFromLibraryName', () => {

        it('should be able to infer from name', () => {
            const artifact = LibraryDownloads.artifactFromLibraryName('com.mojang:patchy:1.1')

            expect(artifact.path).toBe('com/mojang/patchy/1.1/patchy-1.1.jar')
            expect(artifact.url).toBe('https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar')
            expect(artifact.sha1).toBe('')
        })

    })

})
