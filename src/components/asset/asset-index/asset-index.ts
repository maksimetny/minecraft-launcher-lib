
import { Asset, IAsset } from '../asset';

export type AssetIndexObject = Omit<IAsset, 'path'>;

export interface IAssetIndex {
    objects: Record<string, AssetIndexObject>;
    virtual: boolean;
    map_to_resources?: boolean;
}

export class AssetIndex {

    static from(index: Partial<IAssetIndex>): AssetIndex {
        if (index instanceof AssetIndex) return index;

        const {
            objects,
            virtual,
            map_to_resources,
        } = index;

        return new AssetIndex(objects, virtual, map_to_resources);
    }

    constructor(
        readonly objects: Record<string, AssetIndexObject> = {},
        readonly virtual: boolean = false,
        readonly map_to_resources: boolean = false,
    ) { }

    transformObjects(): Asset[] {
        return Object.entries(this.objects).map(([path, object]) => Asset.from(object, { path }));
    }

}
