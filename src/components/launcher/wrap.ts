
import { spawn, ChildProcess } from 'child_process'
import { join } from 'path'
import { LauncherOptions, ILauncherOptions } from './opts'
import { Platform } from '../util'
import { Argument, Fields } from '../version'

export class Launcher {

    static generateArguments(options: ILauncherOptions): string[] {
        const {
            user,
            directory,
            version,
            overrides,
            platform,
            memory,
            extraArgs
        } = LauncherOptions.resolve(options)

        const s: string = Platform.getSeparator(platform.name) // set separator of classpath

        const classpath: string[] = version.libs.filter(lib => {
            return lib.isApplicable(platform)
        }).map(lib => {
            return directory.getLibraryPath(lib.downloads.artifact.path)
        }).concat(overrides.minecraftJarPath)

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
                        return join(overrides.gameDirectory, 'resources')
                    } // pre-1.6
                }
            })(),
            'assets_index_name': version.assets,
            'version_name': overrides.versionName,
            'version_type': overrides.versionType,
            'game_directory': overrides.gameDirectory,
            'natives_directory': overrides.nativesDirectory,
            'launcher_name': overrides.launcherName,
            'launcher_version': overrides.launcherType,
            'classpath': classpath.filter((path, index, _classpath) => {
                return !_classpath.includes(path, ++index)
            }).join(s)
        } // construct fields

        const formatArgs = (_notFormatedArgs: Argument[], _extraArgs: Argument[] = []) => {
            const _formatedArgs: string[] = []

            const format = (_arg: Argument) => {
                _arg.format(fields).forEach(_value => {
                    _formatedArgs.push(_value)
                })
            }

            _notFormatedArgs.filter(_arg => {
                return _arg.isApplicable(platform)
            }).forEach(format)

            _extraArgs.forEach(format)

            return _formatedArgs
        }

        const { game, jvm } = version.args
        const { mainClass } = version

        return [
            `-Xmx${memory.max}M`,
            `-Xms${memory.min}M`,
            // `-Dfml.ignorePatchDiscrepancies=${true}`,
            // `-Dfml.ignoreInvalidMinecraftCertificates=${true}`
        ].concat(formatArgs(jvm, extraArgs.jvm).concat(mainClass), formatArgs(game, extraArgs.game))
    }

    static launch(options: ILauncherOptions): ChildProcess {
        const opts = LauncherOptions.resolve(options)
        const args = Launcher.generateArguments(opts)
        const { javaPath, cwd } = opts.overrides

        console.log(opts)
        console.log(args)

        return spawn(javaPath, args, { cwd }) as ChildProcess
    }

}
