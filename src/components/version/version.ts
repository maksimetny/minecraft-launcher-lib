
import { VersionDownloads, IVersionDownloads } from './version-downloads';
import { VersionArguments, IVersionArguments } from './version-arguments';
import { Library, ILibrary } from '../library';
import { VersionAssetIndexArtifact, IVersionAssetIndexArtifact } from './version-asset-index-artifact';

export interface IVersion {

    id: string;
    type: string;
    assets: string;
    assetIndex: Partial<IVersionAssetIndexArtifact>;
    mainClass: string;
    downloads: Partial<IVersionDownloads>;
    libraries: Partial<ILibrary>[];
    arguments: Partial<IVersionArguments>;

    /**
     * *(only old versions)*
     */
    minecraftArguments?: string;

}

export class Version {

    static from(child: Partial<IVersion>, parent?: Partial<IVersion>): Version {
        if (!parent) {
            if (child instanceof Version) return child;
            parent = {};
        }

        const {
            assetIndex: _assetIndex = {},
            downloads: _downloads = {},
            libraries: _libs = [],
            arguments: _args = { game: [], jvm: VersionArguments.DEFAULT_JVM_ARGS.concat() },
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

        if (!mainClass) throw new Error('version main class is not string');
        if (!id) throw new Error('version id is not string');
        if (!type) throw new Error('version type is not string');
        if (!assets) throw new Error('version assets id is not string');

        {
            const flatLibs = libs.map(({ name }) => name);
            _libs.filter(_lib => !flatLibs.includes(_lib.name)).forEach(_lib => libs.push(_lib));
        } // consolidate libs

        const _versionArgs = VersionArguments.from(_args);
        const versionArgs = VersionArguments.from(args);

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
            const { game, jvm } = VersionArguments.fromLegacyArguments(minecraftArguments);
            versionArgs.game = game.concat(versionArgs.game);
            versionArgs.jvm = jvm.concat(versionArgs.jvm);
        }

        return new Version(
            id,
            type,
            assets,
            VersionAssetIndexArtifact.from(assetIndex, { path: assets + '.json' }),
            mainClass,
            downloads,
            libs,
            versionArgs,
        );
    }

    private _assetIndex: VersionAssetIndexArtifact;
    private _downloads: VersionDownloads;
    private _libs: Library[];
    private _args: VersionArguments;

    constructor(
        public id: string,
        public type: string,
        public assets: string,
        assetIndex: Partial<IVersionAssetIndexArtifact>,
        public mainClass: string,
        downloads: Partial<IVersionDownloads>,
        libs: Partial<ILibrary>[] = [],
        args: Partial<IVersionArguments> = {},
    ) {
        this._assetIndex = VersionAssetIndexArtifact.from(assetIndex);
        this._downloads = VersionDownloads.from(downloads);
        this._args = VersionArguments.from(args);
        this._libs = libs.map(lib => Library.from(lib));
    }

    get downloads(): VersionDownloads { return this._downloads; }

    set downloads(downloads: VersionDownloads) {
        this._downloads = VersionDownloads.from(downloads);
    }

    get libraries(): Library[] { return this.libs; }

    set libraries(libs: Library[]) { this.libs = libs; }

    get libs(): Library[] { return this._libs; }

    set libs(libs: Library[]) {
        this._libs = libs.map(lib => Library.from(lib));
    }

    get args(): VersionArguments { return this._args; }

    set args(args: VersionArguments) {
        this._args = VersionArguments.from(args);
    }

    get assetIndex(): VersionAssetIndexArtifact { return this._assetIndex; }

    set assetIndex(assetIndex: VersionAssetIndexArtifact) {
        this._assetIndex = VersionAssetIndexArtifact.from(assetIndex);
    }

    toString(): string {
        return `${this.type} ${this.id}`;
    }

    toJSON(): IVersion {
        const {
            id,
            type,
            assets,
            downloads,
            args,
            libraries,
            mainClass,
            assetIndex,
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
        };
    }

}
