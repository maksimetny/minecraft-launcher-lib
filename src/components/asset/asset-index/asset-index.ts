
import { Asset, IAsset } from '../asset';

export interface IAssetIndex {

    /**
     * The asset list.
     */
    objects: {
        [path: string]: Omit<IAsset, 'path'>;
    };

    virtual?: boolean;
    map_to_resources?: boolean;

}

export class AssetIndex {

    static from(child: Partial<IAssetIndex>, parent?: Partial<IAssetIndex>): AssetIndex {
        if (!parent) {
            if (child instanceof AssetIndex) return child;
            parent = {};
        }

        const {
            objects = parent.objects,
            virtual = parent.virtual,
            map_to_resources = parent.map_to_resources,
        } = child;

        // TODO child objects extends parent objects

        return new AssetIndex(
            objects,
            virtual,
            map_to_resources,
        );
    }

    constructor(
        public objects: IAssetIndex['objects'] = {},
        public virtual: boolean = false,
        public map_to_resources: boolean = false,
    ) { }

    /**
     * Gets new array of resolved assets.
     * @returns The asset array.
     */
    transformObjects(): Asset[] {
        return Object.entries(this.objects).map(([path, object]) => Asset.from(object, { path }));
    }

}
