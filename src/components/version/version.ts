
import { Library, ILibrary } from '../library';
import { VersionDownloads, IVersionDownloads } from './version-downloads';
import { VersionArguments, IVersionArguments } from './version-arguments';
import { MOJANG } from '../../constants/urls';
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

    static from(version: Partial<IVersion>, parent: Partial<IVersion> = {}, repoURL: string = MOJANG.LIBS_REPO): Version {
        if (version instanceof Version) return version;

        const {
            id: _id,
            type: _type,
            assets: _assets,
            assetIndex: _assetIndex = {},
            mainClass: _mainClass,
            downloads: _downloads = {},
            libraries: _libs = [],
            arguments: _args = { game: [], jvm: VersionArguments.DEFAULT_JVM_ARGS.concat() },
            minecraftArguments: _minecraftArguments,
        } = parent;
        const {
            id = _id,
            type = _type,
            assets = _assets,
            assetIndex = _assetIndex,
            mainClass = _mainClass,
            downloads = _downloads,
            libraries: libs = _libs,
            arguments: args = _args,
            minecraftArguments = _minecraftArguments,
        } = version;

        if (typeof mainClass !== 'string') throw new Error('version main class is not string');
        if (typeof id !== 'string') throw new Error('version id is not string');
        if (typeof type !== 'string') throw new Error('version type is not string');
        if (typeof assets !== 'string') throw new Error('version assets id is not string');

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
            const {
                game,
                jvm,
            } = VersionArguments.fromLegacyArguments(minecraftArguments);
            versionArgs.game = game.concat(versionArgs.game);
            versionArgs.jvm = jvm.concat(versionArgs.jvm);
        }

        return new Version(
            id,
            type,
            assets,
            VersionAssetIndexArtifact.from(assetIndex, { path: assets + '.json' }),
            mainClass,
            VersionDownloads.from(downloads),
            libs.map(lib => Library.from(lib, repoURL)),
            VersionArguments.from(versionArgs),
        );
    }

    private _id: string;
    private _type: string;
    private _assets: string;
    private _assetIndex: VersionAssetIndexArtifact;
    private _mainClass: string;
    private _downloads: VersionDownloads;
    private _libs: Library[];
    private _args: VersionArguments;

    constructor(
        id: string,
        type: string,
        assets: string,
        assetIndex: Partial<IVersionAssetIndexArtifact>,
        mainClass: string,
        downloads: Partial<IVersionDownloads>,
        libs: Partial<ILibrary>[] = [],
        args: Partial<IVersionArguments> = {},
    ) {
        this._id = id;
        this._type = type;
        this._assets = assets;
        this._assetIndex = VersionAssetIndexArtifact.from(assetIndex);
        this._downloads = VersionDownloads.from(downloads);
        this._mainClass = mainClass;
        this._args = VersionArguments.from(args);
        this._libs = libs.map(lib => Library.from(lib));
    }

    get id(): string { return this._id; }

    get type(): string { return this._type; }

    get assets(): string { return this._assets; }

    get downloads(): VersionDownloads { return this._downloads; }

    get libraries(): Library[] { return this.libs; }

    get libs(): Library[] { return this._libs; }

    get args(): VersionArguments { return this._args; }

    get assetIndex(): VersionAssetIndexArtifact { return this._assetIndex; }

    get mainClass(): string { return this._mainClass; }

    // TODO isLegacy() { }

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
