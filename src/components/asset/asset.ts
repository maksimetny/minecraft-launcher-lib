
import { MOJANG } from '../../constants';
import { join } from 'path';
import { Artifact } from '../artifact';

export interface IAsset {
    path: string;
    hash: string;
    size: number;
}

export class Asset {

    static from(assetObject: Omit<Partial<IAsset>, 'path'>, defaultAssetObject: Partial<IAsset> = {}): Asset {
        if (assetObject instanceof Asset) return assetObject;

        const {
            hash = defaultAssetObject.hash,
            size = defaultAssetObject.size,
        } = assetObject;

        if (typeof defaultAssetObject.path !== 'string') throw new Error('default asset path is not string');
        if (typeof hash !== 'string') throw new Error('asset hash is not string');
        if (typeof size !== 'number') throw new Error('asset size is not number');

        return new Asset(defaultAssetObject.path, hash, size);
    }

    constructor(
        private _path: string,
        private _hash: string,
        private _size: number,
    ) { }

    get path(): string {
        return this._path;
    }

    get hash(): string {
        return this._hash;
    }

    get subhash(): string {
        return this._hash.substring(0, 2);
    }

    get size(): number {
        return this._size;
    }

    /**
     * @returns a legacy path, e.g. `virtual/legacy/lang/ru_RU.lang`.
     */
    get legacyPath(): string {
        return join('virtual', 'legacy', this.path);
    }

    /**
     * @returns a path, it should look like `objects/<subhash>/<hash>`, e.g. `objects/00/00..b8f`.
     **/
    get objectPath(): string {
        return join('objects', this.subhash, this.hash);
    }

    toArtifact(legacy = false, repoURL = MOJANG.RESOURCE_REPO): Artifact {
        return new Artifact(
            legacy ? this.legacyPath : this.objectPath,
            `${repoURL}/${this.subhash}/${this.hash}`,
            this.size,
            this.hash,
        );
    }

    toString(): string {
        return this.legacyPath;
    }

    toJSON(): IAsset {
        const {
            hash,
            path,
            size,
        } = this;
        return {
            hash,
            path,
            size,
        };
    }

}
