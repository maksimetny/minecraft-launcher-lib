
import { Artifact, IArtifact } from './artifact'

export interface ILibraryDownloads {

    artifact: IArtifact

    /**
     * `natives-${os}`, `javadoc`, `sources`
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
                const { artifact = LibraryDownloads.artifactFromLibraryName(_name) } = _downloads, _artifact = Artifact.resolve(artifact)
                downloads = new LibraryDownloads(_artifact, { /* classifiers */ })
            } // library artifact

            {
                const { classifiers = { /* classifier: artifact */ } } = _downloads

                Object.entries(_natives).map(([os, classifier]) => {
                    return {
                        classifier,
                        os,
                        include: classifier in classifiers
                    }
                }).filter(({ include }) => !include).forEach(({ classifier, os }) => {
                    classifiers[classifier] = LibraryDownloads.artifactFromLibraryName(`${_name}:natives-${os}`)
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
    static artifactFromLibraryName(name: string) {
        const splitted = name.split(':')

        {
            if (splitted.length >= 3) {
                const [_group, _artifact, _version, ..._extra] = splitted
                const path = `${_group.replace(/\./g, '/')}/${_artifact}/${_version}/${_artifact}-${_version.concat(..._extra.map(_e => `-${_e}`))}.jar`
                return new Artifact(`${urls.DEFAULT_REPO_URL}/${path}`, path, String() /* 0 */)
            } else {
                const path = `${splitted.join('-')}.jar`
                return new Artifact(String(), path, String() /* 0 */)
            }
        }
    }

    // /**
    //  * @param path It should look like `com/mojang/patchy/1.1/patchy-1.1.jar`
    //  */
    // static artifactFromLibraryPath(path: string) { }

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
                    natives = { /* `${os}`: `natives-${os}` */ }
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
        const classifier = lib.natives[platform.name], { [classifier]: artifact } = lib.downloads.classifiers
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

}
