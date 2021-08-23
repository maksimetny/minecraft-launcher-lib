
import { config } from 'dotenv';
config();

import {
    Authenticator,
    Launcher,
    // LauncherOptions,
    LauncherFolder,
    // Downloader,
    Version,
    // VersionDownloads,
    // VersionArguments,
    // Library,
    // Rule,
    // Asset,
    // AssetIndex,
    // Argument,
    // Artifact,
    // Action,
    // OS,
    // Platform,
    // currentPlatform,
} from '../index';

import { readJson, ensureDir } from 'fs-extra';

import {
    resolve,
    join,
} from 'path';

const {
    PARENT_VERSION_ID: versionId = '1.14.4',
    LAUNCHER_DIR = 'launcher',
} = process.env;

// async function download(resources: Resource[], partLength = 4) {
//     const parts: Resource[][] = [];

//     resources.forEach(resource => {
//         const part = [resource]; // new part
//         if (parts.length) {
//             const last = parts[parts.length - 1];
//             if (last.length < partLength) {
//                 last.push(resource);
//                 return;
//             }
//         }
//         parts.push(part);
//     });

//     const downloadResource = async (resource: Resource, force = false) => {
//         resource.on(baseEvents.DEBUG, (e) => console.log(`${resource.name} => ${e}`));
//         resource.on(baseEvents.ERROR, (e, err) => {
//             console.error(`${resource.name} => ${e}`, err);
//         });

//         if (!force) {
//             const success = await resource.isSuccess();
//             if (success) return success;
//         }

//         return await resource.download();
//     };

//     for await (const part of parts) {
//         const downloadPromises = part.map(async resource => {
//             const success = await downloadResource(resource);
//             return {
//                 resource,
//                 success,
//             };
//         });

//         const results = await Promise.all(downloadPromises);
//         results.forEach(({ resource, success }) => {
//             console.log(resource.path + ' =>', success);
//         });
//     }
// }

(async () => {
    const versionJsonPath = join('mock', 'versions', versionId, `${versionId}.json`);
    const version = Version.from(await readJson(versionJsonPath));

    const launcherFolder = LauncherFolder.from(resolve(LAUNCHER_DIR));

    const gameDirectory = launcherFolder.join('instances', versionId);
    await ensureDir(gameDirectory);

    // const resources_1: Resource[] = [];
    // const resources_2: Resource[] = [];

    // const pushToResources = (resource: Resource, resources: Resource[]) => {
    //     const include = resources
    //         .map(({ path }) => path)
    //         .includes(resource.path);

    //     if (!include) resources.push(resource);
    //     return resource;
    // };

    // version.libs
    //     .filter(lib => {
    //         return lib.isApplicable();
    //     }).map(lib => {
    //         return lib.downloads.artifact.toResource(launcherFolder.libs);
    //     }).map(resource => {
    //         return pushToResources(resource, resources_1);
    //     });

    // const natives = version.libs
    //     .filter(lib => {
    //         return lib.isApplicable();
    //     })
    //     .filter(lib => {
    //         return lib.hasNative();
    //     })
    //     .map(lib => {
    //         const classifier = lib.getNativeClassifier();
    //         const native = lib.downloads.getArtifactByClassifier(classifier);

    //         return native.toResource(launcherFolder.libs);
    //     })
    //     .map(resource => {
    //         return pushToResources(resource, resources_1);
    //     });

    // const versionJar = version.downloads.client.changePath(version.id + '.jar').toResource(launcherFolder.join('versions', version.id));
    // pushToResources(versionJar, resources_1);

    // const assetIndexJson = Artifact.from(version.assetIndex).toResource(launcherFolder.join('assets', 'indexes'));
    // pushToResources(assetIndexJson, resources_1);

    // await download(resources_1);

    // for await (const native of natives) {
    //     await native.extractTo(launcherFolder.join('natives', versionId));
    // }

    // const assetIndex = AssetIndex.from(await assetIndexJson.parseJSON());

    // assetIndex.objectsToAssets().map(asset => {
    //     const resource = asset.toArtifact().toResource(launcherFolder.join('assets'));
    //     return pushToResources(resource, resources_2);
    // });

    // await download(resources_2);

    const _process = Launcher.launch({
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
    });

    if (_process.stdout) _process.stdout.setEncoding('utf-8');
    if (_process.stderr) _process.stderr.setEncoding('utf-8');

    if (_process.stdout) _process.stdout.on('data', e => console.log(`[${_process.pid}] ${e}`));
    if (_process.stderr) _process.stderr.on('data', e => console.log(`[${_process.pid}] ${e}`));

    _process.on('close', code => console.log(code));
})().catch(err => console.error('[FATAL]', err));
