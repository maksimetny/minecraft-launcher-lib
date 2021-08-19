
import {
    spawn,
    ChildProcess,
} from 'child_process';
import { join } from 'path';
import { LauncherOptions, ILauncherOptions } from './options';
import { Argument } from '../argument';

export class Launcher {

    /**
     * Construct arguments array for child process by launcher options.
     *
     * This function is useful if you want to launch the process by yourself.
     * This function will NOT check if the runtime libs are completed, and WONT'T check or extract native libs.
     *
     * @param options
     */
    static constructArguments(options: ILauncherOptions): string[] {
        const {
            user,
            launcherFolder,
            version,
            overrides,
            platform,
            features,
            resolution,
            extraArgs,
            baseJvmArgs,
        } = LauncherOptions.from(options);

        const classpath = new Set([
            ...version.libs.filter(lib => {
                return lib.isApplicable(platform, features);
            }).map(lib => {
                return launcherFolder.getLibraryPath(lib.downloads.artifact.path);
            }),
            overrides.minecraftJarPath,
        ]); // construct libs paths for `classpath` argument

        const fields: Map<string, string> = new Map([
            ['auth_access_token', user.accessToken],
            ['auth_session', user.accessToken],
            ['auth_player_name', user.profile.name],
            ['auth_uuid', user.profile.id],
            ['user_type', user.type],
            [
                'user_properties',
                JSON.stringify({
                    // default user prop
                }),
            ],
            ['assets_root', launcherFolder.join('assets')],
            [
                'game_assets',
                (() => {
                    switch (version.assets) {
                        case 'legacy': {
                            return launcherFolder.join('assets', 'virtual', 'legacy');
                        }
                        default: {
                            return join(overrides.gameDirectory, 'resources');
                        } // pre-1.6
                    }
                })(),
            ],
            ['assets_index_name', version.assets],
            ['version_name', overrides.versionName],
            ['version_type', overrides.versionType],
            ['game_directory', overrides.gameDirectory],
            ['natives_directory', overrides.nativesDirectory],
            ['launcher_name', overrides.launcherName],
            ['launcher_version', overrides.launcherType],
            ['resolution_width', `${resolution.width ?? 800}`],
            ['resolution_height', `${resolution.height ?? 600}`],
            [
                'classpath',
                (() => {
                    return Array.from(classpath).join(platform.classpathSeparator);
                })(),
            ],
        ]); // construct values of fields in arguments

        const formatArgs = (_args: Argument[], _extraArgs: Argument[] = []) => {
            const _formatedArgs: string[] = [];

            _args.concat(_extraArgs).filter(_arg => {
                return _arg.isApplicable(platform, features);
            }).forEach(_arg => {
                _arg.format(fields).forEach(_value => {
                    _formatedArgs.push(_value);
                });
            });

            return _formatedArgs;
        };

        if (resolution.height && resolution.width) {
            features.has_custom_resolution = true;
        } else if (resolution.fullscreen) {
            extraArgs.game.push(Argument.fromString('--fullscreen'));
        }

        return [
            ...formatArgs(baseJvmArgs),
            ...formatArgs(version.args.jvm, extraArgs.jvm),
            version.mainClass,
            ...formatArgs(version.args.game, extraArgs.game),
        ];
    }

    /**
     * Launch a child process.
     * This function use spawn to create child process.
     *
     * To use an alternative way, see function constructArguments.
     *
     * @param options
     */
    static launch(options: ILauncherOptions): ChildProcess {
        const opts = LauncherOptions.from(options);
        const {
            javaPath,
            cwd,
        } = opts.overrides;

        return spawn(javaPath, Launcher.constructArguments(opts), {
            cwd,
            ...opts.extraSpawnOptions,
        });
    }

}
