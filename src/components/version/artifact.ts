
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

    static resolve(_artifact: Partial<IArtifact>, _default: IArtifact = {
        path: String(),
        sha1: String(),
        url: String()
    }) {
        if (_artifact instanceof Artifact) {
            return _artifact
        } else {
            const {
                path: _path = _default.path,
                sha1: _sha1 = _default.sha1, url: _url = _default.url } = _artifact

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

    toResource(directory: string) {
        // return new Resource(this.url, join(directory, this.path), this.sha1)
        return Artifact.toResource({ ...this }, directory)
    }

} // resolved artifact
