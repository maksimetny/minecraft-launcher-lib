
import { IProfile } from '../user'

type User = {

    accessToken: string

    /**
     * User type for launch args.
     */
    type: string

    profile: IProfile

}

type Memory = {

    /**
     * Min memory, this will add
     * a jvm flag `-Xmx` to the command result.
     * Определяет максимальный размер памяти.
     */
    max: number

    /**
     * Min memory, this will add
     * a jvm flag `-Xms` to the command result.
     * Определяет размер начальной выделенной памяти.
     * (`-Xms`, примерно равен `-Xmx`)
     */
    min: number

}

type Overrides = {

    /**
     * Launcher brand. Is used for
     * `-Dminecraft.launcher.brand` argument.
     */
    launcherName: string

    /**
     * Launcher version. Is used for
     * `-Dminecraft.launcher.version` argument.
     */
    launcherType: string

    /**
     * Overwrite version name of current version.
     * If this is absent, it will use
     * version ID from resolved version.
     */
    versionName: string

    /**
     * Overwrite version type of current version.
     * If this is absent, it will use
     * version type from resolved version.
     */
    versionType: string

    /**
     * Path to directory of assets.
     */
    assetsDirectory: string

    /**
     * Path to game directory for `saves`,
     * `logs`, `configs`, `mods` or other.
     */
    gameDirectory: string

    /**
     * Path to directory of natives.
     */
    nativesDirectory: string

    cwd: string

    minecraftJarPath: string

    /**
     * Path to java executable.
     * Like `java` or `D://jre/javaw.exe`.
     */
    javaPath: string

}

import { currentPlatform, Platform, IPlatform, LauncherLocation, LauncherFolder } from '../util'
import { Version, IVersion } from '../version'

export interface ILauncherOptions {

    user: User

    directory: LauncherLocation

    version: any

    memory?: Memory

    platform?: Partial<IPlatform>

    /**
     * Extra JVM args. If this is empty,
     * `DEFAULT_EXTRA_JVM_ARGS` will be used.
     */
    extraJvmArgs?: string[]

    /**
     * Extra game args.
     */
    extraArgs?: string[]

    /**
     * Simplified overrides so launcher devs
     * can set whatever they want.
     */
    overrides?: Partial<Overrides>

}

export class LauncherOptions implements ILauncherOptions {

    static resolve(opts: ILauncherOptions) {
        if (opts instanceof LauncherOptions) {
            return opts
        } else {
            if (!opts.directory) { throw new Error('missing launcher directory!') }

            const {
                user,
                version,
                directory,
                memory = { max: 1024, min: 512 },
                platform = currentPlatform,
                extraArgs = [],
                extraJvmArgs = [], // DEFAULT_EXTRA_JVM_ARGS
                overrides = { /* custom paths */ }
            } = opts

            return new LauncherOptions(
                user,
                LauncherFolder.from(directory),
                Version.resolve(version),
                memory,
                platform,
                extraArgs,
                extraJvmArgs,
                overrides
            )
        }
    }

    readonly overrides: Overrides

    constructor(
        readonly user: User,
        readonly directory: LauncherFolder,
        readonly version: Version,
        readonly memory: Memory,
        readonly platform: Partial<IPlatform>,
        readonly extraArgs: string[],
        readonly extraJvmArgs: string[],
        overrides: Partial<Overrides>
    ) {
        const {
            launcherName = 'MCLL',
            launcherType = 'release',
            versionName = version.id,
            versionType = version.type,
            assetsDirectory = directory.getPathTo('assets'),
            gameDirectory = directory.path,
            nativesDirectory = directory.getPathTo('natives', version.id),
            cwd = directory.path,
            minecraftJarPath = directory.getPathTo('versions', version.id, `${version.id}.jar`),
            javaPath = 'java'
        } = overrides

        this.overrides = {
            launcherName,
            launcherType,
            versionName,
            versionType,
            assetsDirectory,
            gameDirectory,
            nativesDirectory,
            cwd,
            minecraftJarPath,
            javaPath
        }
    }

}
