
import { events, urls } from '../constants'
import {
    Authenticator,
    Launcher,
    Downloader,
    Version,
    VersionDownloads,
    VersionArguments,
    Library,
    Rule,
    Asset,
    Action,
    Argument,
    Artifact,
    Resource,
    OS,
    currentPlatform
} from '../index'
import * as _mkdirp from 'mkdirp'
import * as _fs from 'fs'
import * as _path from 'path'

async function launch(custom: string) {
    
    const version = Version.resolve(require(`../../launcher/versions/${custom}/${custom}.json`))
    
    const instanceDirectory = _path.resolve('launcher', 'instances', custom)

    // if (!_fs.existsSync(instanceDirectory)) _mkdirp.sync(instanceDirectory)

    const args = Launcher.constructArguments({
        user: {
            accessToken: Authenticator.newToken(),
            type: 'legacy',
            profile: {
                name: 'steve',
                id: Authenticator.newToken()
            }
        },
        version,
        directory: _path.resolve('launcher'),
        overrides: {
            instanceDirectory
        },
        features: { is_demo_user: false, download_only: false },
        // baseJVMArgs: [],
        extraSpawnOptions: { detached: true },
        // platform: { name: OS.WINDOWS, version: '10.0' },
        // window: { width: 800, height: 600, fullscreen: false },
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
        //     Argument.fromString('-Dfile.encoding=UTF-8')
        // ])
    })

    console.log(args)
    
}

launch('1.14.4').catch(err => {
    console.error('[FATAL]', err)
})
