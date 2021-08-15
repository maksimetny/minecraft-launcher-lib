
import { Asset, IAsset } from './asset'

export type AssetIndexObject = Omit<IAsset, 'path'>

export interface IAssetIndex {
    objects: Record<string, AssetIndexObject>
    virtual: boolean
    map_to_resources?: boolean
}

export class AssetIndex {

    static from(index: Partial<IAssetIndex>): AssetIndex {
        if (index instanceof AssetIndex) {
            return index
        }

        const {
            objects = { /* [path]: object */ },
            virtual = false,
            map_to_resources = false,
        } = index

        return new AssetIndex(objects, virtual, map_to_resources)
    }

    constructor(
        private _objects: Record<string, AssetIndexObject>,
        private _virtual: boolean,
        private _map_to_resources: boolean = false,
    ) { }

    get objects() {
        return this._objects
    }

    get virtual() { return this._virtual }

    set virtual(virtual: boolean) { this._virtual = virtual }

    get map_to_resources() { return this._map_to_resources }

    set map_to_resources(value: boolean) { this._map_to_resources = value }

    objectsToAssets() {
        return Object.entries(this._objects)
            .map(([
                path, {
                    hash,
                    size,
                },
            ]) => {
                return new Asset(path, hash, size)
            })
    }

}
