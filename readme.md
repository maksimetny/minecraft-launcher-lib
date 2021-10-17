
Minecraft Launcher Lib (MCLL) is a NodeJS solution for launching modified and vanilla Minecraft client.

![logo](https://raw.githubusercontent.com/maksimetny/minecraft-launcher-lib/master/logo.jpg)

## Installing

`npm i minecraft-launcher-lib`

Use only latest version of [MCLL](https://www.npmjs.com/package/minecraft-launcher-lib) module.

## Usage

```typescript
import { Launcher, LauncherFolder, MVersion, readJson } from 'minecraft-launcher-lib';
import { join } from 'path';

const folder = LauncherFolder.from(LAUNCHER_ROOT);
const versionJsonPath = join(folder.getVersionPath(VERSION_ID), VERSION_ID + '.json');

const launcher = new Launcher({
    auth: {
        accessToken: AUTH_ACCESS_TOKEN,
        user: {
            uuid: AUTH_USER_UUID,
            type: AUTH_USER_TYPE,
            name: AUTH_USER_NAME,
            properties: {},
        },
    },
    minecraftVersion: MVersion.from(await readJson(versionJsonPath)),
    folder,
    // platform: { name: OS.WINDOWS, version: '10.0' },
    features: {
        has_fullscreen: true,

        // has_autoconnect: { server_host: 'localhost', server_port: '25565' },
        // has_autoconnect: true,

        // has_custom_resolution: { resolution_width: '800', resolution_height: '600' },
        // has_custom_resolution: true, // if use this, defaults value will be used

        has_custom_memory: { memory_max: '1G', memory_min: '512M' },
        // has_custom_memory: true,

        ignore_patch_discrepancies: true,
        ignore_invalid_minecraft_certificates: true,

        is_demo_user: true,
    },
    // extraArgs: { game: [], jvm: [] },
    overrides: {
        'launcher_name': 'MCLL', // override launcher brand (defaults: minecraft-launcher-lib)
        'launcher_version': '1.0.0', // defaults `release`
        'version_type': 'demo', // defaults inherits minecraft version id
    },
});

const childProcess = launcher.launch();
const log = (data: string) => console.log(`[${childProcess.pid}] ${data}`);

if (childProcess.stdout) {
    childProcess.stdout.setEncoding('utf-8');
    childProcess.stdout.on('data', (data) => log(data));
}

if (childProcess.stderr) {
    childProcess.stderr.setEncoding('utf-8');
    childProcess.stderr.on('data', (data) => log(data));
}

childProcess.on('close', (code) => console.log('minecraft exited with code: ' + code));
```

A detailed description of the use is in `usage.md`.

## License

The MIT license. See `LICENSE`.
