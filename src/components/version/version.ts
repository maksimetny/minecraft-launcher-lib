
import { IArtifact } from '../artifact';
import { Argument } from '../argument';
import { VersionDownloads, IVersionDownloads } from './downloads';
import { VersionArguments, IVersionArguments } from './arguments';
import { Library, ILibrary } from '../library';
import { MOJANG } from '../../constants/urls';

export interface IVersion {
    id: string;
    type: string;
    assets: string;
    downloads: IVersionDownloads;
    arguments: IVersionArguments;
    mainClass: string;
    libraries: ILibrary[];
    minecraftArguments?: string;
    assetIndex: IAssetIndexArtifact;
}

interface IAssetIndexArtifact extends IArtifact {

    /**
     * This like assets prop in version attrs.
     **/
    id: string;

    totalSize: number;

}

export class Version {

    static from(_version: Partial<IVersion>, _default: Partial<IVersion> = { /* parent */ }, _repoURL: string = MOJANG.LIBS_REPO): Version {
        if (_version instanceof Version) return _version;
        const {
            id: _id,
            type: _type,
            assets: _assets,
            downloads: _downloads,
            mainClass: _mainClass,
            libraries: _libs = [],
            arguments: _args = { game: [], jvm: VersionArguments.DEFAULT_JVM_ARGS },
            minecraftArguments: _minecraftArguments,
            assetIndex: _assetIndex,
        } = _default;
        const {
            id = _id,
            type = _type,
            assets = _assets,
            downloads = _downloads,
            mainClass = _mainClass,
            libraries: libs = _libs,
            arguments: args = _args,
            minecraftArguments = _minecraftArguments,
            assetIndex = _assetIndex,
        } = _version;

        if (!assetIndex) throw new Error('missing asset index');
        if (!id) throw new Error('missing id');
        if (!type) throw new Error('missing type');
        if (!assets) throw new Error('missing assets');
        if (!downloads) throw new Error('missing downloads');
        if (!mainClass) throw new Error('missing main class');

        const flatLibs = libs.map(({ name }) => name);
        _libs.forEach(_lib => {
            const contains = flatLibs.includes(_lib.name);
            if (!contains) libs.push(_lib);
        });

        const _versionArgs = VersionArguments.from(_args);
        const versionArgs = VersionArguments.from(args);

        const _gameArgs = _versionArgs.game.map(_arg => Argument.from(_arg));
        const gameArgs = versionArgs.game.map(arg => Argument.from(arg));
        const flatArgsSep = ' ';
        const flatGameArgs = gameArgs.map(({ value }) => value.join(flatArgsSep));
        _gameArgs.forEach(_arg => {
            const contains = flatGameArgs.includes(_arg.value.join(flatArgsSep));
            if (!contains) versionArgs.game.push(_arg);
        });

        const _jvmArgs = _versionArgs.jvm.map(_arg => Argument.from(_arg));
        const jvmArgs = versionArgs.jvm.map(arg => Argument.from(arg));
        const flatJvmArgs = jvmArgs.map(({ value }) => value.join(flatArgsSep));
        _jvmArgs.forEach(_arg => {
            const contains = flatJvmArgs.includes(_arg.value.join(flatArgsSep));
            if (!contains) versionArgs.jvm.push(_arg);
        });

        if (minecraftArguments) {
            const {
                game,
                jvm,
            } = VersionArguments.fromLegacyArguments(minecraftArguments);
            versionArgs.game = game.concat(versionArgs.game);
            versionArgs.jvm = jvm.concat(versionArgs.jvm);
        }

        assetIndex.path = assets + '.json';

        return new Version(
            id,
            type,
            assets,
            VersionDownloads.from(downloads),
            VersionArguments.from(versionArgs),
            libs.map(lib => Library.from(lib, _repoURL)),
            assetIndex,
            mainClass,
        );
    }

    constructor(
        private _id: string,
        private _type: string,
        private _assets: string,
        private _downloads: VersionDownloads,
        private _args: VersionArguments,
        private _libs: Library[],
        private _assetIndex: IAssetIndexArtifact,
        private _mainClass: string,
    ) { }

    get id(): string { return this._id; }

    get type(): string { return this._type; }

    get assets(): string { return this._assets; }

    get downloads(): VersionDownloads { return this._downloads; }

    get libraries(): Library[] { return this.libs; }

    get libs(): Library[] { return this._libs; }

    get args(): VersionArguments { return this._args; }

    get assetIndex(): IAssetIndexArtifact { return this._assetIndex; }

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
            libs,
            mainClass,
            assetIndex,
        } = this;
        return {
            id,
            type,
            assets,
            downloads,
            'arguments': args,
            'libraries': libs,
            mainClass,
            assetIndex,
        };
    }

}
