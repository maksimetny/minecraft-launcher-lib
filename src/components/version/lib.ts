
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

    static resolve(_downloads: Partial<ILibraryDownloads>, _name: string, _natives: LibraryNatives) {
        if (_downloads instanceof LibraryDownloads) {
            return _downloads
        } else {
            let downloads: LibraryDownloads

            {
                const _default = LibraryDownloads.artifactFromLibraryName(_name) // default artifact
                const { artifact: _artifact = _default } = _downloads
                // ! default url !
                downloads = new LibraryDownloads(Artifact.resolve(_artifact, { path: _default.path }), { /* classifiers */ })
            } // library artifact

            {
                const { classifiers = { /* classifier: artifact */ } } = _downloads

                Object.entries(_natives).map(([os, classifier]) => {
                    return {
                        classifier,
                        os,
                        include: classifier in classifiers
                    }
                }).filter(({ include }) => !include).forEach(({ classifier }) => {
                    // ! format classifier !
                    classifiers[classifier] = LibraryDownloads.artifactFromLibraryName(`${_name}:${classifier}`)
                })

                Object.entries(classifiers).forEach(([classifier, artifact]) => {
                    return downloads.setArtifactForClassifier(classifier, artifact)
                })
            } // classifiers

            return downloads
        }
    }

    /**
     * @param path It should look like `com.mojang:patchy:1.1`
     */
    static artifactFromLibraryName(name: string): Artifact {
        const splitted = name.split(':')
        {
            if (splitted.length >= 3) {
                const [group, artifact, version, ...extra] = splitted
                const path = `${group.replace(/\./g, '/')}/${artifact}/${version}/${artifact}-${version.concat(...extra.map(e => `-${e}`))}.jar`
                return Artifact.resolve({ path, url: `${urls.DEFAULT_REPO_URL}/${path}` })
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

import { unpack } from '../util'
import { join } from 'path'
import { Argument } from './arg'

export class Library implements ILibrary {

    static resolve(_libs: Partial<ILibrary>[]) {
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
                    LibraryDownloads.resolve(downloads, name, natives),
                    natives,
                    extract,
                    Rule.resolve(rules)
                )
            }
        })
    }

    static extractNatives(library: ILibrary, platform: IPlatform, libsDirectory: string, nativesDirectory: string) {
        const [lib] = Library.resolve([library])
        const classifier = lib.getNativeClassifier(platform), { [classifier]: artifact } = lib.downloads.classifiers
        unpack(join(libsDirectory, artifact.path), nativesDirectory, lib.extract.exclude)
    }

    constructor(
        readonly name: string,
        readonly downloads: LibraryDownloads,
        readonly natives: LibraryNatives,
        readonly extract: LibraryExtract,
        readonly rules: Rule[]
    ) { }

    isApplicable(platform: Partial<IPlatform>, features: Features = { /* features */ }): boolean {
        return Rule.isAllowable(this.rules, platform, features)
    }

    hasNatives(os: OS = currentPlatform.name): boolean {
        return this.natives[os] ? true : false
    }

    getNativeClassifier(platform: Platform = currentPlatform): string {
        switch (platform.arch) {
            case 'x64': {
                return Argument.format(this.natives[platform.name], { arch: '64' })
            }
            default: {
                return Argument.format(this.natives[platform.name], { arch: '32' })
            } // x32 or other
        }
    }

}
