
import { IManifestItem } from './manifest-item';

/**
 * The versions manifest.
 * @see https://minecraft.gamepedia.com/version_manifest.json
 */
export interface IManifest {

    /**
     * The list of available versions.
     */
    versions: IManifestItem[];

    /**
     * The latest versions id's.
    */
    latest: {
        snapshot: string;
        release: string;
    };

}
