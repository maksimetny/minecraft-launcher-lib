
import { spawn, ChildProcess, SpawnOptions } from 'child_process';
import { join } from 'path';
import { LauncherOptions, ILauncherOptions } from './launcher-options';
import { Argument } from '../argument';

export class Launcher {

    opts: LauncherOptions;

    constructor(
        options: ILauncherOptions,
    ) {
        this.opts = LauncherOptions.from(options);
    }

    /**
     * Construct arguments array for child process.
     *
     * This function is useful if you want to launch the process by yourself.
     * This function will **NOT** check if the runtime libs are completed, and **WON'T** check or extract native libs.
     */
    constructArguments(): string[] {
        const {
            minecraftVersion,
            platform,
            features,
            extraArgs,
            overrides,
        } = this.opts;

        const classpath: Set<string> = this.constructClasspath();

        const fields: Map<string, string> = new Map([
            this.opts.getField('auth_access_token'),
            this.opts.getField('auth_session'),
            this.opts.getField('auth_player_name'),
            this.opts.getField('auth_uuid'),

            this.opts.getField('user_type'),
            this.opts.getField('user_properties'),

            this.opts.getField('assets_root'),

            this.opts.getField('game_assets'),

            this.opts.getField('assets_index_name'),

            this.opts.getField('version_name'),
            this.opts.getField('version_type'),

            this.opts.getField('game_directory'),

            this.opts.getField('natives_directory'),

            ['launcher_name', 'minecraft-launcher-lib'],
            ['launcher_version', 'release'],

            this.opts.getFeatureField('has_custom_resolution', 'resolution_width', '800'),
            this.opts.getFeatureField('has_custom_resolution', 'resolution_height', '600'),

            ['classpath', Array.from(classpath).join(platform.classpathSeparator)],

            this.opts.getFeatureField('has_custom_memory', 'memory_max', '1G'),
            this.opts.getFeatureField('has_custom_memory', 'memory_min', '512M'),

            this.opts.getFeatureField('ignore_patch_discrepancies', 'ignorePatchDiscrepancies', 'true'),
            this.opts.getFeatureField('ignore_invalid_minecraft_certificates', 'ignoreInvalidMinecraftCertificates', 'true'),

            this.opts.getFeatureField('has_autoconnect', 'server_host', 'localhost'),
            this.opts.getFeatureField('has_autoconnect', 'server_port', '25565'),

            ...Object.entries(overrides),
        ]); // construct values of argument fields

        const formatArgs = (args: Argument[]): string[] => args
            .filter(arg => arg.isApplicable(platform, features))
            .map(arg => arg.format(fields))
            .flat();

        const game = minecraftVersion.args.game.concat(extraArgs.game);
        const jvm = minecraftVersion.args.jvm.concat(extraArgs.jvm); // final unformatted jvm arguments

        return formatArgs(jvm).concat(minecraftVersion.mainClass, ...formatArgs(game));
    }

    /**
     * Construct libs paths for `classpath` argument.
     */
    constructClasspath(): Set<string> {
        const {
            folder,
            minecraftVersion,
            platform,
            features,
        } = this.opts;

        return new Set(
            minecraftVersion.libs
                .filter(lib => lib.isApplicable(platform, features))
                .map(lib => {
                    return folder.getLibraryPath(lib.downloads.artifact.path);
                })
                .concat(join(folder.versions, minecraftVersion.id, minecraftVersion.id + '.jar')),
        );
    }

    /**
     * Launch a game.
     * This function use spawn to create child process.
     *
     * To use an alternative way, see function constructArguments.
     *
     * @param javaPath The path to java executable. By default `java`.
     * @param spawnOptions The process spawn options.
     */
    launch(javaPath: string = 'java', spawnOptions: SpawnOptions = {}): ChildProcess {
        return spawn(
            javaPath,
            this.constructArguments(),
            Object.assign({ cwd: this.opts.folder.root }, spawnOptions), // final spawn options
        );
    }

}
