
export interface ILauncherFeatures {

    [feature: string]: unknown;

    is_demo_user?: boolean;

    has_custom_resolution?: boolean | { resolution_width: string; resolution_height: string };

    has_custom_memory?: boolean | { memory_max: string; memory_min: string };

    has_autoconnect?: boolean | { server_host: string; server_port: string };

    ignore_patch_discrepancies?: boolean | { ignorePatchDiscrepancies: boolean };

    ignore_invalid_minecraft_certificates?: boolean | { ignoreInvalidMinecraftCertificates: boolean };

}
