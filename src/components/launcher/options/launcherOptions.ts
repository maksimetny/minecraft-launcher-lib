
import {
    IProfile,
} from '../../authenticator';

type User = {

    accessToken: string;

    /**
     * User type for launch args.
     */
    type: string;

    // properties?: UserProperties

    profile: IProfile;

};

type Memory = {

    /**
     * Min memory, this will add
     * a jvm flag `-Xmx` to the command result.
     * Определяет максимальный размер памяти.
     */
    max: number;

    /**
     * Min memory, this will add
     * a jvm flag `-Xms` to the command result.
     * Определяет размер начальной выделенной памяти.
     * (`-Xms`, примерно равен `-Xmx`)
     */
    min: number;

};

type Overrides = {

    /**
     * Launcher brand. Is used for `-Dminecraft.launcher.brand` argument.
     */
    launcherName: string;

    /**
     * Launcher version. Is used for
     * `-Dminecraft.launcher.version` argument.
     */
    launcherType: string;

    /**
     * Overwrite version name of current version.
     * If this is absent, it will use
     * version ID from resolved version.
     */
    versionName: string;

    /**
     * Overwrite version type of current version.
     * If this is absent, it will use
     * version type from resolved version.
     */
    versionType: string;

    /**
     * Path to directory of natives.
     * It's `launcher/natives/<version>` by default.
     */
    nativesDirectory: string;

    cwd: string;

    minecraftJarPath: string;

    /**
     * Path to java executable, e.g. `java` or `D://jre/javaw.exe`.
     */
    javaPath: string;

    /**
     * Path to game directory.
     */
    gameDirectory: string;

};

type Resolution = { width?: number; height?: number; fullscreen?: boolean };

import * as child_process from 'child_process';
import {
    Platform,
    IPlatform,
} from '../../platform';

import {
    Argument,
    IArgument,
} from '../../argument';

import {
    LauncherFolder,
    LauncherLocation,
} from '../folder';

import {
    Version,
    IVersion,
    VersionArguments,
    IVersionArguments,
} from '../../version';

export interface ILauncherOptions {

    user: User;

    launcherFolder: LauncherLocation;

    version: Partial<IVersion>;

    features?: Record<string, boolean>;

    memory?: Memory;

    extraArgs?: Partial<IVersionArguments>;

    /**
     * If you use this, `ignoreInvalidMinecraftCertificates`, `ignorePatchDiscrepancies` and `memory` props will not be used.
     */
    baseJvmArgs?: IArgument[];

    /**
     * Assign spawn options to process.
     */
    extraSpawnOptions?: child_process.SpawnOptions;

    /**
     * The platform of this launch will run. By default, it will fetch the current machine info if this is absent.
     */
    platform?: Partial<IPlatform>;

    /**
     * Simplified overrides so launcher devs
     * can set whatever they want.
     */
    overrides?: Partial<Overrides>;

    /**
     * Add `-Dfml.ignoreInvalidMinecraftCertificates` to JVM argument.
     */
    ignoreInvalidMinecraftCertificates?: boolean;

    /**
     * Add `-Dfml.ignorePatchDiscrepancies` to JVM argument.
     */
    ignorePatchDiscrepancies?: boolean;

    /**
     * Window resolution. This will add `--height` & `--width` or `--fullscreen` to arguments.
     */
    resolution?: Resolution;

}

import {
    join,
} from 'path';

export class LauncherOptions implements ILauncherOptions {

    static from(opts: ILauncherOptions): LauncherOptions {
        if (opts instanceof LauncherOptions) return opts;

        const {
            user,
            version,
            launcherFolder,
            features = { /* enabled features */ },
            platform = new Platform(),
            memory = { max: 1024, min: 512 },
            extraArgs = { game: [/* default game args */], jvm: [/* default jvm args */] },
            extraSpawnOptions = { /* spawn options */ },
            ignorePatchDiscrepancies = true,
            ignoreInvalidMinecraftCertificates = true,
            resolution = { /* window resolution */ },
            overrides = { /* custom paths */ },
            baseJvmArgs = [
                new Argument([
                    `-Xmx${memory.max}M`,
                    `-Xms${memory.min}M`,
                ]),
                new Argument([
                    `-Dfml.ignorePatchDiscrepancies=${ignorePatchDiscrepancies}`,
                ]),
                new Argument([
                    `-Dfml.ignoreInvalidMinecraftCertificates=${ignoreInvalidMinecraftCertificates}`,
                ]),
            ],
        } = opts;

        switch (typeof launcherFolder) {
            case 'string': break;
            case 'object': {
                if (launcherFolder instanceof LauncherFolder) break;
            }
            default: {
                throw new Error('launcher folder not string or instance of launcher folder');
            }
        }

        return new LauncherOptions(
            user,
            LauncherFolder.from(launcherFolder),
            Version.from(version),
            features,
            memory,
            resolution,
            Platform.from(platform),
            VersionArguments.from(extraArgs),
            baseJvmArgs.map(arg => Argument.from(arg)),
            extraSpawnOptions,
            overrides,
            ignoreInvalidMinecraftCertificates,
            ignorePatchDiscrepancies,
        );
    }

    private _overrides: Overrides;

    constructor(
        private _user: User,
        private _launcherFolder: LauncherFolder,
        private _version: Version,
        private _features: Record<string, boolean>,
        private _memory: Memory,
        private _resolution: Resolution,
        private _platform: Platform,
        private _extraArgs: VersionArguments,
        private _baseJvmArgs: Argument[],
        private _extraSpawnOptions: child_process.SpawnOptions,
        _overrides: Partial<Overrides>,
        public ignoreInvalidMinecraftCertificates: boolean,
        public ignorePatchDiscrepancies: boolean,
    ) {
        const {
            launcherName = 'MCLL',
            launcherType = 'release',
            versionName = _version.id,
            versionType = _version.type,
            gameDirectory = _launcherFolder.path,
            nativesDirectory = join(_launcherFolder.natives, _version.id),
            cwd = gameDirectory,
            minecraftJarPath = _launcherFolder.getPathTo('versions', _version.id, `${_version.id}.jar`),
            javaPath = 'java',
        } = _overrides;

        this._overrides = {
            launcherName,
            launcherType,
            versionName,
            versionType,
            gameDirectory,
            nativesDirectory,
            cwd,
            minecraftJarPath,
            javaPath,
        };
    }

    get user(): User { return this._user; }

    get launcherFolder(): LauncherFolder { return this._launcherFolder; }

    get version(): Version { return this._version; }

    get features(): Record<string, boolean> { return this._features; }

    get memory(): Memory { return this._memory; }

    get resolution(): Resolution { return this._resolution; }

    get platform(): Platform { return this._platform; }

    get extraArgs(): VersionArguments { return this._extraArgs; }

    get baseJvmArgs(): Argument[] { return this._baseJvmArgs; }

    get extraSpawnOptions(): child_process.SpawnOptions { return this._extraSpawnOptions; }

    get overrides(): Overrides { return this._overrides; }

}
