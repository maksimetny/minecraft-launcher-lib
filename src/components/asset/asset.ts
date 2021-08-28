
import { MOJANG } from '../../constants';
import { join } from 'path';
import { Artifact } from '../artifact';

export interface IAsset {
    path: string;
    hash: string;
    size: number;
}

export class Asset {

    static from(assetObject: Omit<Partial<IAsset>, 'path'>, parent: Partial<IAsset> = {}): Asset {
        if (assetObject instanceof Asset) return assetObject;

        const {
            hash = parent.hash,
            size = parent.size,
        } = assetObject;

        if (!parent.path) throw new Error('missing parent asset path');
        if (!hash) throw new Error('missing asset hash');
        if (!size) throw new Error('missing asset size');

        return new Asset(parent.path, hash, size);
    }

    constructor(
        public path: string,
        public hash: string,
        public size: number,
    ) { }

    get subhash(): string {
        return this.hash.substring(0, 2);
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

    toJSON(): Omit<IAsset, 'path'> {
        const {
            hash,
            size,
        } = this;
        return {
            hash,
            size,
        };
    }

}
