
export interface IArtifact {
    path: string
    url: string
    sha1: string
}

import {
    Resource,
} from '../resource'

import { join } from 'path'

export class Artifact implements IArtifact {

    static from(_artifact: Partial<IArtifact>, _default: Partial<IArtifact> = { /* default */ }): Artifact {
        if (_artifact instanceof Artifact) {
            return _artifact
        }

        const {
            path: _path = _default.path,
            url: _url = _default.url,
            sha1: _sha1 = _default.sha1,
        } = _artifact

        if (typeof _path !== 'string') throw new Error('artifact path not string')

        if (typeof _url !== 'string') throw new Error('artifact url not string')

        if (typeof _sha1 !== 'string') throw new Error('artifact sha1 not string')

        return new Artifact(_path, _url, _sha1)
    }

    static isDownloadable(artifact: Partial<IArtifact>) {
        return ![
            'path',
            'url',
            'sha1',
        ].map(prop => artifact.hasOwnProperty(prop)).includes(false)
    }

    /**
     * @param a name, it should look like `<group>:<artifact>:<version>`, e.g. `com.mojang:patchy:1.1`.
     * @param a repo, it should look like URL, e.g. `https://libraries.mojang.com` or `http://127.0.0.1`.
     */
    static fromString(name: string, repoURL: string, sha1 = '') {
        const parts = name.split(':')

        if (parts.length >= 3) {
            const [grp, art] = parts
            const ext = parts.length > 3 ? parts[2] : 'jar'
            const ver = parts[parts.length - 1]

            const paths: string[] = [
                ...grp.split('.'),
                art,
                ver,
                [
                    art,
                    '-' + ver,
                    parts.length > 4 ? '-' + parts[3] : '',
                    '.' + ext,
                ].join(''),
            ]

            return Artifact.from({
                path: join(...paths),
                url: repoURL + '/' + paths.join('/'),
                sha1,
            })
        }

        throw new Error('a name string not include maven name')
    }

    constructor(
        private _path: string,
        private _url: string,
        private _sha1: string,
    ) { }

    get url() {
        return this._url
    }

    set url(_url) {
        this._url = _url
    }

    get path() { return this._path }

    set path(_path) { this._path = _path }

    get sha1() { return this._sha1 }

    set sha1(_sha1) { this._sha1 = _sha1 }

    changePath(path: string) {
        this.path = path
        return this
    }

    changeURL(url: string) {
        this.url = url
        return this
    }

    changeSHA1(sha1: string) {
        this.sha1 = sha1
        return this
    }

    toResource(directory: string): Resource {
        return new Resource(join(directory, this.path), this.url, this.sha1)
    }

    /**
     * @returns a name, it should look like `<group>:<artifact>:<version>`, e.g. `com.mojang:patchy:1.1`.
     */
    toString(): string {
        const parts: string[] = this.path.split('/')
        const name = parts.slice(-1).join()

        const extSepIndex = name.lastIndexOf('.')
        const firstNumIndex = name.search(/\d/)

        const grp = parts.slice(0, parts.length - 3).join('.')
        const art = name.slice(0, firstNumIndex - 1)
        const ver = name.slice(firstNumIndex, extSepIndex)
        // const ext = name.slice(extSepIndex).slice(1)

        // TODO classifier, extension

        return `${grp}:${art}:${ver}`
    }

    toJSON(): IArtifact {
        const {
            path,
            url,
            sha1,
        } = this

        return {
            path,
            url,
            sha1,
        }
    }

}
