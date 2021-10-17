
import { MOJANG } from '../../constants';
import { join } from 'path';
import { Artifact } from '../artifact';

export interface IAsset {
    path: string;
    hash: string;
    size: number;
}

export class Asset {

    static from(child: Omit<Partial<IAsset>, 'path'>, parent?: Partial<IAsset>): Asset {
        if (!parent) {
            if (child instanceof Asset) return child;
            parent = {};
        }

        const {
            hash = parent.hash,
            size = parent.size,
        } = child;

        if (!parent.path) throw new Error('missing parent asset path');
        if (!hash) throw new Error('missing asset hash');
        if (!size) throw new Error('missing asset size');

        return new Asset(
            parent.path,
            hash,
            size,
        );
    }

    constructor(
        public path: string,
        public hash: string,
        public size: number,
    ) { }

    /**
     * The first 2 hex letters of hash.
     */
    get subhash(): string {
        return this.hash.substring(0, 2);
    }

    /**
     * The legacy path. It should look like `virtual/legacy/<path>`, e.g. `virtual/legacy/lang/ru_RU.lang`.
     */
    get legacyPath(): string {
        return join('virtual', 'legacy', this.path);
    }

    /**
     * The object path. It should look like `objects/<subhash>/<hash>`, e.g. `objects/00/00..b8f`.
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
