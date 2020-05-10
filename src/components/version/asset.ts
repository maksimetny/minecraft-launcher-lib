
import * as artifact from './artifact'
import { join } from 'path'
import { urls } from '../../constants'

export class Asset {

    static fromObjects(objects: {
        [path: string]: { hash: string }
    }) {
        return Object.entries(objects).map(([
            path, { hash }
        ]) => {
            return new Asset(path, hash)
        })
    }

    constructor(readonly path: string, readonly hash: string) { }

    get subhash() {
        return this.hash.substring(0, 2)
    }

    /**
     * For example, `launcher/assets/objects/00/00..b8f` or
     * `launcher/assets/virtual/legacy/lang/ru_RU.lang`.
     */
    getPath(legacy = false) {
        return legacy ? join('virtual', 'legacy', this.path) : join('objects', this.subhash, this.hash)
    }

    toArtifact() {
        return new artifact.Artifact(`${urls.DEFAULT_RESOURCE_URL}/${this.subhash}/${this.hash}`, this.getPath(), this.hash)
    }

}
