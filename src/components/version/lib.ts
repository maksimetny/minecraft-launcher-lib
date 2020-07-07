
import { Artifact, IArtifact } from './artifact'

export interface ILibraryDownloads {

    artifact: IArtifact

    /**
     * Like `javadoc`, `sources`, `natives-${os}` or `natives-${os}-${arch}`
     */
    classifiers?: { [name: string]: IArtifact }

}

type LibraryNatives = { [os: string]: string }

export class LibraryDownloads implements ILibraryDownloads {

    static resolve(_downloads: Partial<ILibraryDownloads>, _name: string, _natives: LibraryNatives, _repo: string = urls.DEFAULT_REPO_URL) {
        if (_downloads instanceof LibraryDownloads) {
            return _downloads
        } else {
            let downloads: LibraryDownloads

            {
                const _default = LibraryDownloads.artifactFromLibraryName(_name, _repo)
                const { artifact: _artifact = _default } = _downloads
                const _a = Artifact.resolve(_artifact, _default)
                downloads = new LibraryDownloads(_a, { /* classifiers */ })
            } // library artifact

            {
                const { classifiers = { /* classifier: artifact */ } } = _downloads

                const artifactFromLibraryName = (classifier: string) => {
                    return LibraryDownloads.artifactFromLibraryName(`${_name}:${classifier}`, _repo)
                }

                Object.entries(_natives).map(([os, classifier]) => {
                    return {
                        classifier,
                        // os,
                        include: classifier in classifiers
                    }
                }).filter(({ include }) => !include).forEach(({ classifier }) => {
                    // ! format classifier !
                    classifiers[classifier] = artifactFromLibraryName(classifier)
                })

                Object.entries(classifiers).forEach(([classifier, artifact]) => {
                    const _default = artifactFromLibraryName(classifier)
                    const _a = Artifact.resolve(artifact, _default)
                    return downloads.setArtifactForClassifier(classifier, _a)
                })
            } // classifiers

            return downloads
        }
    }

    /**
     * @param path It should look like `com.mojang:patchy:1.1`
     */
    static artifactFromLibraryName(name: string, repo: string = urls.DEFAULT_REPO_URL): Artifact {
        const splitted = name.split(':')
        {
            if (splitted.length >= 3) {
                const [group, artifact, version, ...extra] = splitted
                const classifier = extra.map(e => `-${e}`)
                const path = `${group.replace(/\./g, '/')}/${artifact}/${version}/${artifact}-${version.concat(...classifier)}.jar`

                return Artifact.resolve({
                    path,
                    url: `${repo}/${path}`
                })
            } else {
                return Artifact.resolve({ path: `${splitted.join('-')}.jar` })
            }
        }
    }

    constructor(readonly artifact: Artifact, readonly classifiers: { [name: string]: Artifact }) { }

    setArtifactForClassifier(classifier: string, artifact: IArtifact) {
        this.classifiers[classifier] = Artifact.resolve(artifact) // resolved classified artifact
    }

}

import { Rule, IRule, Features } from './rule'
import { currentPlatform, Platform, IPlatform, OS } from '../util'
import { urls } from '../../constants'

type LibraryExtract = { exclude: string[] }

export interface ILibrary {

    downloads: ILibraryDownloads

    /**
     * A maven name for library,
     * in form of `group:artifact:version`.
     */
    name: string

    natives: LibraryNatives

    rules: IRule[]

    extract: LibraryExtract

}

import { Argument } from './arg'
import * as _path from 'path'

export class Library implements ILibrary {

    static resolve(_libs: Partial<ILibrary>[], _repo: string = urls.DEFAULT_REPO_URL) {
        return _libs.map(_lib => {
            if (_lib instanceof Library) {
                return _lib
            } else {
                if (!_lib.name) throw new Error('missing library name!')

                const {
                    name,
                    downloads = { /* artifact, classifiers */ } as Partial<ILibraryDownloads>,
                    extract = {
                        exclude: [
                            'META-INF/'
                        ]
                    },
                    rules = [],
                    natives = { /* `${os}`: `natives-${os}` or `natives-${os}-${arch}` */ }
                } = _lib

                return new Library(
                    name,
                    LibraryDownloads.resolve(downloads, name, natives, _repo),
                    natives,
                    extract,
                    Rule.resolve(rules)
                )
            }
        })
    }

    static extractNatives(
        libs: Partial<ILibrary>[],
        libsDirectory: string,
        nativesDirectory: string,
        unpack: (path: string, unpackTo: string, exclude: string[]) => void,
        platform: Partial<IPlatform> = { /* platform */ }
    ) {
        Library.resolve(libs).filter(lib => {
            return lib.hasNatives(platform.name)
        }).map(lib => {
            const artifact = lib.downloads.classifiers[lib.getNativeClassifier(platform)]
            return {
                exclude: lib.extract.exclude,
                path: _path.join(libsDirectory, artifact.path)
            }
        }).map(({ path, exclude }) => {
            unpack(path, nativesDirectory, exclude)
        })
    }

    constructor(
        readonly name: string,
        readonly downloads: LibraryDownloads,
        readonly natives: LibraryNatives,
        readonly extract: LibraryExtract,
        readonly rules: Rule[]
    ) { }

    isApplicable(platform: Partial<IPlatform> = { /* platform */ }, features: Features = { /* features */ }): boolean {
        return Rule.isAllowable(this.rules, platform, features)
    }

    hasNatives(os: OS = currentPlatform.name): boolean {
        return Object.keys(this.natives).includes(os)
    }

    getNativeClassifier(platform: Partial<IPlatform> = { /* platform */ }): string {
        const {
            name = currentPlatform.name,
            arch = currentPlatform.arch } = platform

        const format = (_arch: string) => {
            const fields = new Map([
                ['arch', _arch]
            ])

            return Argument.format(this.natives[name], fields)
        }

        switch (arch) {
            case 'x64': {
                return format('64')
            }
            default: {
                return format('32')
            } // x32 or other
        }
    }

}
