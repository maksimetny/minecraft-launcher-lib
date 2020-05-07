
export interface IArtifact {
    path: string
    url: string
    sha1: string
}

import { Resource } from '../downloader'
import { join } from 'path'

export class Artifact implements IArtifact {

    // static resolve(_artifact: IArtifact) {
    //     if (_artifact instanceof Artifact) {
    //         return _artifact
    //     } else {
    //         return new Artifact(_artifact.url, _artifact.path, _artifact.sha1)
    //     }
    // }

    static resolve(_artifact: Partial<IArtifact>, _default: Partial<IArtifact> = { /* default */ }) {
        if (_artifact instanceof Artifact) {
            return _artifact
        } else {
            const { path: defaultPath = '/', sha1: defaultSHA1 = String(), url: defaultURL = '/' } = _default
            const {
                path: _path = defaultPath,
                sha1: _sha1 = defaultSHA1, url: _url = defaultURL } = _artifact

            return new Artifact(_url, _path, _sha1)
        }
    }

    static toResource(artifact: IArtifact, directory: string) {
        return new Resource(artifact.url, join(directory, artifact.path), artifact.sha1)
    }

    static isDownloadable(artifact: Partial<IArtifact>) {
        return !['path', 'url', 'sha1'].map(prop => prop in artifact).includes(false)
    } // checking required props

    static setSHA1(artifact: Partial<IArtifact>, sha1: string) {
        artifact.sha1 = sha1
        // return this
    }

    static setURL(artifact: Partial<IArtifact>, url: string) {
        artifact.url = url
        // return this
    }

    static setPath(artifact: Partial<IArtifact>, path: string) {
        artifact.path = path
        // return this
    }

    constructor(readonly url: string, readonly path: string, readonly sha1: string) { }

    setSHA1(sha1: string) {
        Artifact.setSHA1(this, sha1)
        return this
    }

    setURL(url: string) {
        Artifact.setURL(this, url)
        return this
    }

    setPath(path: string) {
        Artifact.setPath(this, path)
        return this
    }

    toResource(directory: string) {
        // return new Resource(this.url, join(directory, this.path), this.sha1)
        return Artifact.toResource({ ...this }, directory)
    }

} // resolved artifact
