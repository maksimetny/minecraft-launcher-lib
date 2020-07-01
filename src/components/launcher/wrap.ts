
import { spawn, ChildProcess } from 'child_process'
import { join } from 'path'
import { LauncherOptions, ILauncherOptions } from './opts'
import { Platform } from '../util'
import { Argument, Fields } from '../version'

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
            directory,
            version,
            overrides,
            platform,
            features,
            window,
            extraArgs,
            baseJVMArgs
        } = LauncherOptions.resolve(options)

        const s: string = Platform.getSeparator(platform.name) // set separator of classpath

        const classpath: string[] = [
            ...version.libs.filter(lib => {
                return lib.isApplicable(platform, features)
            }).map(lib => {
                return directory.getLibraryPath(lib.downloads.artifact.path)
            }),
            overrides.minecraftJarPath
        ]

        const fields: Fields = {
            'auth_access_token': user.accessToken,
            'auth_session': user.accessToken,
            'auth_player_name': user.profile.name,
            'auth_uuid': user.profile.id,
            'user_type': user.type,
            'user_properties': JSON.stringify({ /* default user prop */ }),
            'assets_root': directory.getPathTo('assets'),
            'game_assets': (() => {
                switch (version.assets) {
                    case 'legacy': {
                        return directory.getPathTo('assets', 'virtual', 'legacy')
                    }
                    default: {
                        return join(overrides.instanceDirectory, 'resources')
                    } // pre-1.6
                }
            })(),
            'assets_index_name': version.assets,
            'version_name': overrides.versionName,
            'version_type': overrides.versionType,
            'game_directory': overrides.instanceDirectory,
            'natives_directory': overrides.nativesDirectory,
            'launcher_name': overrides.launcherName,
            'launcher_version': overrides.launcherType,
            'resolution_width': window.width ? `${window.width}` : '800', 'resolution_height': window.height ? `${window.height}` : '600',
            'classpath': classpath.filter((path, index, _classpath) => {
                return !_classpath.includes(path, ++index)
            }).join(s)
        } // construct fields

        const formatArgs = (_args: Argument[], _extraArgs: Argument[] = []) => {
            const _formatedArgs: string[] = []

            const format = (_arg: Argument) => {
                _arg.format(fields).forEach(_value => {
                    _formatedArgs.push(_value)
                })
            }

            _args.filter(_arg => {
                return _arg.isApplicable(platform, features)
            }).forEach(format)

            _extraArgs.filter(_arg => {
                return _arg.isApplicable(platform, features)
            }).forEach(format)

            return _formatedArgs
        }

        if (window.height && window.width) {
            features.has_custom_resolution = true
        } else {
            if (window.fullscreen) {
                extraArgs.game.push(Argument.fromString('--fullscreen'))
            }
        }

        return [
            ...formatArgs(baseJVMArgs),
            ...formatArgs(version.args.jvm, extraArgs.jvm).concat(version.mainClass).concat(formatArgs(version.args.game, extraArgs.game))
        ]
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
        const opts = LauncherOptions.resolve(options)
        const {
            javaPath,
            cwd
        } = opts.overrides

        return spawn(javaPath, Launcher.constructArguments(opts), {
            cwd,
            ...opts.extraSpawnOptions
        })
    }

}
