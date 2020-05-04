
/**
 * List of available versions.
 * @see https://minecraft.gamepedia.com/version_manifest.json
 */
export interface IManifest {

    latest: {
        snapshot: string
        release: string
    }

    versions: IManifestItem[]

}

/**
 * Object of metadata containing version info,
 * like `version.json` URL.
 */
export interface IManifestItem {

    /**
     * URL to `<id>.json` for this version.
     */
    url: string

    /**
     * ID of this version.
     */
    id: string

    /**
     * Type of this version (`release`, `snapshot`).
     */
    type: string

    /**
     * A timestamp in `ISO 8601` format of when version files
     * were last updated on the manifest.
     */
    time: string

    /**
     * The release time of this version in `ISO 8601` format.
     */
    releaseTime: string

}
