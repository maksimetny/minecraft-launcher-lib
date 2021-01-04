
import { Artifact } from '../artifact'
import { join } from 'path'
import { urls } from '../../constants'

export type AssetIndexObject = Omit<IAsset, 'path'>

export interface IAssetIndex {
    objects: Record<string, AssetIndexObject>
}

export interface IAsset {
    path: string
    hash: string
    size: number
}

export class Asset {

    static parseAssets(index: IAssetIndex): Asset[] {
        return Object.entries(index.objects).map(([
            path, {
                hash,
                size,
            },
        ]) => {
            return new Asset(path, hash, size)
        })
    }

    constructor(
        private _path: string,
        private _hash: string,
        private _size: number,
    ) { }

    get path() {
        return this._path
    }

    get hash() {
        return this._hash
    }

    get subhash() {
        return this._hash.substring(0, 2)
    }

    get size() {
        return this._size
    }

    /**
     * @returns path, e.g. `virtual/legacy/lang/ru_RU.lang`.
     */
    get objectLegacyPath() {
        return join('virtual', 'legacy', this.path)
    }

    /**
     * @returns path, e.g. `objects/00/00..b8f`.
     **/
    get objectPath() {
        return join('objects', this.subhash, this.hash)
    }

    toArtifact(legacy = false, repoURL = urls.DEFAULT_RESOURCE_REPO) {
        const path = legacy ? this.objectLegacyPath : this.objectPath
        const url = `${repoURL}/${this.subhash}/${this.hash}`
        const sha1 = this.hash

        return new Artifact(path, url, sha1)
    }

    toString(): string {
        return this.objectLegacyPath
    }

    toJSON(): IAsset {
        const {
            hash,
            path,
            size,
        } = this

        return {
            hash,
            path,
            size,
        }
    }

}
