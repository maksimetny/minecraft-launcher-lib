
import {
    events,
    urls,
} from '../constants'

import {
    Authenticator,
    Launcher,
    LauncherOptions,
    LauncherFolder,
    // Downloader,
    Version,
    VersionDownloads,
    VersionArguments,
    Library,
    Rule,
    Asset,
    Argument,
    Artifact,
    Resource,
    Action,
    OS,
    Platform,
    currentPlatform,
} from '../index'

import {
    readJson,
    mkdirp,
} from 'fs-extra'

import {
    resolve,
    join,
} from 'path'

async function launch(custom: string) {
    const versionJsonPath = join('mock', 'versions', custom, `${custom}.json`)
    const version = Version.from(await readJson(versionJsonPath))

    const launcherFolder = LauncherFolder.from(resolve('launcher'))

    const gameDirectory = launcherFolder.getPathTo('instances', custom)
    await mkdirp(gameDirectory)

    const args = Launcher.constructArguments({
        user: {
            accessToken: Authenticator.newToken(),
            type: 'legacy',
            profile: {
                name: 'steve',
                id: Authenticator.newToken(),
            },
        },
        version,
        launcherFolder,
        overrides: {
            gameDirectory,
        },
        features: { is_demo_user: false, download_only: false },
        // baseJvmArgs: [],
        extraSpawnOptions: { detached: true },
        // platform: { name: OS.WINDOWS, version: '10.0' },
        // resolution: { width: 800, height: 600, fullscreen: false },
        // memory: { min: 1024, max: 1024 },
        // extraArgs: new VersionArguments([
        //     Argument.fromString('--server play.hypixel.net --port 25565')
        // ], [
        //     Argument.fromString('-XX:+UseCMSInitiatingOccupancyOnly'),
        //     Argument.fromString('-XX:+CMSParallelRemarkEnabled'),
        //     Argument.fromString('-XX:+CMSClassUnloadingEnabled'),
        //     Argument.fromString('-XX:+UseConcMarkSweepGC'),
        //     Argument.fromString('-XX:+ParallelRefProcEnabled'),
        //     Argument.fromString('-XX:-UseAdaptiveSizePolicy'),
        //     Argument.fromString('-Dfile.encoding=UTF-8'),
        // ]),
    })

    console.log(args)
}

launch('1.14.4').catch(error => console.error('[FATAL]', error))
