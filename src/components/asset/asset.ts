
import { Artifact } from '../artifact';
import { join } from 'path';
import { MOJANG } from '../../constants';

export interface IAsset {
    path: string;
    hash: string;
    size: number;
}

export class Asset {

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
     * @returns path, e.g. `virtual/legacy/lang/ru_RU.lang`.
     */
    get objectLegacyPath(): string {
        return join('virtual', 'legacy', this.path);
    }

    /**
     * @returns path, e.g. `objects/00/00..b8f`.
     **/
    get objectPath(): string {
        return join('objects', this.subhash, this.hash);
    }

    toArtifact(legacy = false, repoURL = MOJANG.RESOURCE_REPO): Artifact {
        const path = legacy ? this.objectLegacyPath : this.objectPath;
        return new Artifact(path, `${repoURL}/${this.subhash}/${this.hash}`, this.size, this.hash);
    }

    toString(): string {
        return this.objectLegacyPath;
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
