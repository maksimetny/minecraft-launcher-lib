
import { MVersionDownloads, IMVersionDownloads } from './m-version-downloads';
import { MVersionArguments, IMVersionArguments } from './m-version-arguments';
import { Library, ILibrary } from '../library';
import { MVersionAssetIndexArtifact, IMVersionAssetIndexArtifact } from './m-version-asset-index-artifact';

export interface IMVersion {

    id: string;
    type: string;
    assets: string;
    assetIndex: Partial<IMVersionAssetIndexArtifact>;
    mainClass: string;
    downloads: Partial<IMVersionDownloads>;
    libraries: Partial<ILibrary>[];
    arguments: Partial<IMVersionArguments>;

    /**
     * *(only child versions)*
     */
    inheritsFrom?: string;

    /**
     * *(only old versions)*
     */
    minecraftArguments?: string;

}

export class MVersion {

    static from(child: Partial<IMVersion>, parent?: Partial<IMVersion>): MVersion {
        if (!parent) {
            if (child instanceof MVersion) return child;
            parent = {};
        }

        const {
            assetIndex: _assetIndex = {},
            downloads: _downloads = {},
            libraries: _libs = [],
            arguments: _args = { game: [], jvm: [] },
        } = parent;
        const {
            id = parent.id,
            type = parent.type,
            assets = parent.assets,
            assetIndex = _assetIndex,
            mainClass = parent.mainClass,
            downloads = _downloads,
            libraries: libs = _libs,
            arguments: args = _args,
            minecraftArguments = parent.minecraftArguments,
        } = child;

        if (!mainClass) throw new Error('minecraft version main class is not string');
        if (!id) throw new Error('minecraft version id is not string');
        if (!type) throw new Error('minecraft version type is not string');
        if (!assets) throw new Error('minecraft version assets id is not string');

        {
            const flatLibs = libs.map(({ name }) => name);
            _libs.filter(_lib => !flatLibs.includes(_lib.name)).forEach(_lib => libs.push(_lib));
        } // consolidate libs

        const _versionArgs = MVersionArguments.from(_args);
        const versionArgs = MVersionArguments.from(args);

        {
            const flatArgsSep = ' ';

            {
                const flatGameArgs = versionArgs.game.map(({ value }) => value.join(flatArgsSep));
                _versionArgs.game
                    .filter(_arg => {
                        return !flatGameArgs.includes(_arg.value.join(flatArgsSep));
                    })
                    .forEach(_arg => versionArgs.game.push(_arg));
            }

            {
                const flatJvmArgs = versionArgs.jvm.map(({ value }) => value.join(flatArgsSep));
                _versionArgs.jvm
                    .filter(_arg => {
                        return !flatJvmArgs.includes(_arg.value.join(flatArgsSep));
                    })
                    .forEach(_arg => versionArgs.jvm.push(_arg));
            }
        } // consolidate args

        if (minecraftArguments) {
            const { game, jvm } = MVersionArguments.fromLegacyArguments(minecraftArguments);
            versionArgs.game = game.concat(versionArgs.game);
            versionArgs.jvm = jvm.concat(versionArgs.jvm);
        }

        return new MVersion(
            id,
            type,
            assets,
            MVersionAssetIndexArtifact.from(assetIndex, { path: assets + '.json' }),
            mainClass,
            downloads,
            libs,
            versionArgs,
        );
    }

    private _assetIndex: MVersionAssetIndexArtifact;
    private _downloads: MVersionDownloads;
    private _libs: Library[];
    private _args: MVersionArguments;

    constructor(
        public id: string,
        public type: string,
        public assets: string,
        assetIndex: Partial<IMVersionAssetIndexArtifact>,
        public mainClass: string,
        downloads: Partial<IMVersionDownloads>,
        libs: Partial<ILibrary>[] = [],
        args: Partial<IMVersionArguments> = {},
        public inheritsFrom?: string,
    ) {
        this._assetIndex = MVersionAssetIndexArtifact.from(assetIndex);
        this._downloads = MVersionDownloads.from(downloads);
        this._args = MVersionArguments.from(args);
        this._libs = libs.map(lib => Library.from(lib));
    }

    get downloads(): MVersionDownloads {
        return this._downloads;
    }

    set downloads(downloads: MVersionDownloads) {
        this._downloads = MVersionDownloads.from(downloads);
    }

    get libraries(): Library[] {
        return this.libs;
    }

    set libraries(libs: Library[]) {
        this.libs = libs;
    }

    get libs(): Library[] {
        return this._libs;
    }

    set libs(libs: Library[]) {
        this._libs = libs.map(lib => Library.from(lib));
    }

    get args(): MVersionArguments {
        return this._args;
    }

    set args(args: MVersionArguments) {
        this._args = MVersionArguments.from(args);
    }

    get assetIndex(): MVersionAssetIndexArtifact {
        return this._assetIndex;
    }

    set assetIndex(assetIndex: MVersionAssetIndexArtifact) {
        this._assetIndex = MVersionAssetIndexArtifact.from(assetIndex);
    }

    toString(): string {
        return this.id;
    }

    toJSON(): IMVersion {
        const {
            id,
            type,
            assets,
            downloads,
            args,
            libraries,
            mainClass,
            assetIndex,
            inheritsFrom,
        } = this;
        return {
            id,
            type,
            assets,
            downloads,
            'arguments': args,
            libraries,
            mainClass,
            assetIndex,
            inheritsFrom,
        };
    }

}
