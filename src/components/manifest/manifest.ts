
import { IManifestVersion } from './manifest-version';

/**
 * The version manifest.
 * @see https://minecraft.gamepedia.com/version_manifest.json
 */
export interface IManifest {

    /**
     * The list of available versions.
     */
    versions: IManifestVersion[];

    /**
     * The latest versions id's.
    */
    latest: {
        snapshot: string;
        release: string;
    };

}
