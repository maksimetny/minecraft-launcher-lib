
import urls from '../../constants/urls'

import { Artifact, IArtifact } from '../artifact'
import { Argument, IArgument } from '../argument'

import { VersionDownloads, IVersionDownloads } from './downloads'

import { VersionArguments, IVersionArguments } from './arguments'

import { Library, ILibrary } from '../library'

export interface IVersion {
    id: string
    type: string
    assets: string
    downloads: IVersionDownloads
    arguments: IVersionArguments
    mainClass: string
    libraries: ILibrary[]
    assetIndex: IAssetIndexArtifact
    minecraftArguments?: string
}

interface IAssetIndexArtifact extends IArtifact {

    /**
     * This like assets prop in version attrs.
     **/
    id: string

    totalSize: number

}

export class Version {

    static from(_version: Partial<IVersion>, _repoURL: string = urls.DEFAULT_LIBS_REPO) {
        if (_version instanceof Version) {
            return _version
        }

        const {
            id: _id,
            type: _type,
            assets: _assets,
            downloads: _downloads,
            arguments: _args = { game: [], jvm: VersionArguments.DEFAULT_JVM_ARGS },
            libraries: _libs = [],
            assetIndex: _assetIndex,
            mainClass: _mainClass,
            minecraftArguments: _minecraftArguments,
        } = _version

        if (!_assetIndex) throw new Error('missing asset index')
        if (!_id) throw new Error('missing id')
        if (!_type) throw new Error('missing type')
        if (!_assets) throw new Error('missing assets')
        if (!_downloads) throw new Error('missing downloads')
        if (!_mainClass) throw new Error('missing main class')

        if (_minecraftArguments) {
            const { game, jvm } = VersionArguments.fromLegacyArguments(_minecraftArguments)
            _args.game.push(...game)
            _args.jvm.push(...jvm)
        }

        const assetIndex: IAssetIndexArtifact = Artifact.changePath(_assets + '.json', _assetIndex) as IAssetIndexArtifact
        const libs: Library[] = _libs.map(_lib => Library.from(_lib, _repoURL))

        return new Version(
            _id,
            _type,
            _assets,
            VersionDownloads.from(_downloads),
            VersionArguments.from(_args),
            libs,
            assetIndex,
            _mainClass,
        )
    }

    constructor(
        private _id: string,
        private _type: string,
        private _assets: string,
        private _downloads: VersionDownloads,
        private _args: VersionArguments,
        private _libs: Library[],
        private _assetIndex: IAssetIndexArtifact,
        private _mainClass: string
    ) { }

    get id() { return this._id }

    get type() { return this._type }

    get assets() { return this._assets }

    get downloads() { return this._downloads }

    get libraries() { return this.libs }

    get libs() { return this._libs }

    get args() { return this._args }

    get assetIndex() { return this._assetIndex }

    get mainClass() { return this._mainClass }

    // TODO isLegacy() { }

    toString(): string {
        return `${this.type} ${this.id}`
    }

    toJSON(): IVersion {
        const {
            id,
            type,
            assets,
            downloads,
            args,
            libs,
            assetIndex,
            mainClass,
        } = this

        return {
            id,
            type,
            assets,
            downloads,
            'arguments': args,
            'libraries': libs,
            assetIndex,
            mainClass,
        }
    }

}
