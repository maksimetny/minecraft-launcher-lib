
import { LauncherFolder, LauncherLocation } from '../launcher-folder';
import { MVersion, IMVersion } from '../../m-version';
import { MVersionArguments, IMVersionArguments } from '../../m-version/m-version-arguments';
import { Argument } from '../../argument';
import { Platform, IPlatform } from '../../platform';
import { ILauncherFeatures } from '../launcher-features';
import { RuleAction } from '../../rule';
import { OfflineAuthenticator, IAuth } from '../../authenticator';
import { join } from 'path';

export interface ILauncherOptions {

    auth?: IAuth;

    folder: LauncherLocation;

    minecraftVersion: Partial<IMVersion>;

    /**
     * The platform of this launch will run.
     * By default, it will fetch the current machine info if this is absent.
     */
    platform?: Partial<IPlatform>;

    features?: ILauncherFeatures;

    /**
     * The extra minecraft version arguments.
     *
     * If you use this, you can override some of the `MCLL` functions.
     *
     * *USE VERY CAREFULLY!*
     */
    extraArgs?: Partial<IMVersionArguments>;

    /**
     * This allows you to override values of argument fields.
     *
     * If you use this, you can override some of the `MCLL` functions.
     *
     * *USE VERY CAREFULLY!*
     */
    overrides?: Record<string, string>;

}

export class LauncherOptions implements ILauncherOptions {

    static from(launcherOptions: ILauncherOptions): LauncherOptions {
        if (launcherOptions instanceof LauncherOptions) return launcherOptions;

        const {
            auth,
            folder,
            minecraftVersion,
            platform = {},
            features = {},
            extraArgs,
            overrides,
        } = launcherOptions;

        return new LauncherOptions(
            auth,
            folder,
            minecraftVersion,
            platform,
            features,
            extraArgs,
            overrides,
        );
    }

    folder: LauncherFolder;

    minecraftVersion: MVersion;

    platform: Platform;

    extraArgs: MVersionArguments;

    constructor(
        public auth: IAuth = new OfflineAuthenticator('MCLL_' + OfflineAuthenticator.generateToken(false).substring(0, 4)).getAuth(),

        location: LauncherLocation,

        minecraftVersion: Partial<IMVersion>,

        platfrom: Partial<IPlatform>,

        public features: ILauncherFeatures = {},

        extraArgs: Partial<IMVersionArguments> = {
            game: [
                Argument.from({
                    value: '--fullscreen',
                    rules: [
                        { action: RuleAction.ALLOW, features: { has_fullscreen: true } },
                    ],
                }),
                Argument.from({
                    value: ['--server ${server_host}', '--port ${server_port}'],
                    rules: [
                        { action: RuleAction.ALLOW, features: { has_autoconnect: true } },
                    ],
                }),
            ],
            jvm: [
                Argument.from({
                    value: ['-Xmx${memory_max}', '-Xms${memory_min}'],
                    rules: [
                        { action: RuleAction.ALLOW, features: { has_custom_memory: true } },
                    ],
                }),
                Argument.from({
                    value: '-Dfml.ignorePatchDiscrepancies=${ignorePatchDiscrepancies}',
                    rules: [
                        { action: RuleAction.ALLOW, features: { ignore_patch_discrepancies: true } },
                    ],
                }),
                Argument.from({
                    value: '-Dfml.ignoreInvalidMinecraftCertificates=${ignoreInvalidMinecraftCertificates}',
                    rules: [
                        { action: RuleAction.ALLOW, features: { ignore_invalid_minecraft_certificates: true } },
                    ],
                }),
            ],
        },

        public overrides: Record<string, string> = {},
    ) {
        this.folder = LauncherFolder.from(location);

        this.minecraftVersion = MVersion.from(minecraftVersion);

        this.platform = Platform.from(platfrom);

        this.extraArgs = MVersionArguments.from(extraArgs);
    }

    /**
     * This returns field or throws `field not found` error.
     */
    getField(field: string): [string, string] {
        switch (field) {
            case 'auth_access_token':
            case 'auth_session': return [field, this.auth.accessToken];
            case 'auth_uuid': return [field, this.auth.uuid];
            case 'auth_player_name': return [field, this.auth.user.name];

            case 'user_type': return [field, this.auth.user.type];
            case 'user_properties': return [field, JSON.stringify(this.auth.user.properties)];

            case 'assets_root': return [field, this.folder.assets];
            case 'game_assets': {
                return [
                    field,
                    this.minecraftVersion.assets !== 'legacy' ? join(this.folder.game, 'resources') : join(this.folder.assets, 'virtual', 'legacy'),
                ];
            }

            case 'assets_index_name': return [field, this.minecraftVersion.assets];

            case 'version_name': return [field, this.minecraftVersion.id];
            case 'version_type': return [field, this.minecraftVersion.type];

            case 'natives_directory': return [field, this.folder.getNativesPath(this.minecraftVersion.id)];

            case 'game_directory': return [field, this.folder.game];

            default: throw new Error('field not found');
        }
    }

    getFeatureField(feature: string, field: string, defaultValue: string): [string, string] {
        switch (typeof this.features[feature]) {
            case 'object': {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (Object.prototype.hasOwnProperty.call(this.features[feature], field)) return [field, String((<any>this.features)[feature]?.[field])];
            }
            default: return [field, defaultValue];
        }
    }

}
