
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

    const loader = Downloader.iteratorFactory(async (resource: Resource) => {
        resource.on(events.DEBUG, e => console.log(e))
        resource.on(events.ERROR, e => console.log(e))
        return _fs.existsSync(resource.path) ? true : await resource.downloadAsync()
        // return await resource.downloadAsync() // force download
    })

    {
        const libs = version.libs.filter(lib => {
            return lib.isApplicable()
        })

        await Downloader.downloadLibs(loader)(libs, _path.resolve('launcher', 'libraries'), { /* platform */ }, { download_only: true })

        const unpack = (path: string, unpackTo: string, exclude: string[]) => {
            // console.log(`unpacking ${path} to ${unpackTo}..`)
        }

        Library.extractNatives(libs, _path.resolve('launcher', 'libraries'), _path.resolve('launcher', 'natives', version.id), unpack, { /* platform */ })
    } // libs

    {
        await loader([
            version.downloads.client.changePath(`${version.id}.jar`).toResource(_path.resolve('launcher', 'versions', version.id))
        ])
    } // version jar

    const instanceDirectory = _path.resolve('launcher', 'instances', custom)

    // if (!_fs.existsSync(instanceDirectory)) _mkdirp.sync(instanceDirectory)

    const _process = Launcher.launch({
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

    // console.log(_process)

    if (_process.stdout) _process.stdout.setEncoding('utf-8')
    if (_process.stderr) _process.stderr.setEncoding('utf-8')

    if (_process.stdout) _process.stdout.on('data', e => console.log(`[${_process.pid}] ${e}`))
    if (_process.stderr) _process.stderr.on('data', e => console.log(`[${_process.pid}] ${e}`))

    _process.on('close', code => console.log(code))
}

launch('1.14.4').catch(err => {
    console.error('[FATAL]', err)
})
