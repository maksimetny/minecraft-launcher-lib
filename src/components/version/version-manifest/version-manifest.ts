
/**
 * The version manifest.
 * @see https://minecraft.gamepedia.com/version_manifest.json
 */
export interface IVersionManifest {

    latest: {
        snapshot: string;
        release: string;
    };

    /**
     * The list of available versions.
     */
    versions: IVersionManifestItem[];

}

/**
 * Containing version metadata.
 */
export interface IVersionManifestItem {

    /**
     * The link to `<id>.json`.
     */
    url: string;

    /**
     * The version ID.
     */
    id: string;

    /**
     * The version type, e.g. `release`, `snapshot`.
     */
    type: string;

    /**
     * A timestamp in `ISO 8601` format of when version files
     * were last updated on the manifest.
     */
    time: string;

    /**
     * The release time in `ISO 8601` format.
     */
    releaseTime: string;

    /**
     * *(v2 only)*
     * The SHA1 hash of `<id>.json`.
     */
    sha1?: string;

    /**
     * *(v2 only)*
     * If 0, launcher warns user about this version not being
     * recent enough to support latest player safety features.
     */
    complianceLevel?: number;

}
