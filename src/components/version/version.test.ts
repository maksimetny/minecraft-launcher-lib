
import { Artifact } from '../artifact';
import { Argument } from '../argument';
import { Rule, RuleAction } from '../rule';
import { OS } from '../platform';
import { Library } from '../library';
import { VersionArguments } from './arguments';
import { VersionDownloads } from './downloads';
import { join } from 'path';
import { readJson } from 'fs-extra';

import {
    Version,
} from './version';

describe('Version', () => {

    it('should create new instance', async () => {

        const downloads = new VersionDownloads(
            Artifact.from({
                sha1: '8c325a0c5bd674dd747d6ebaa4c791fd363ad8a9',
                url: 'https://launcher.mojang.com/v1/objects/8c325a0c5bd674dd747d6ebaa4c791fd363ad8a9/client.jar',
            }, { path: 'client.jar' }),
            // Artifact.from({
            //     sha1: '3dc3d84a581f14691199cf6831b71ed1296a9fdf',
            //     url: 'https://launcher.mojang.com/v1/objects/3dc3d84a581f14691199cf6831b71ed1296a9fdf/server.jar',
            // }, { path: 'server.jar' }),
        );

        const args = new VersionArguments(
            [
                Argument.from('--username ${auth_player_name}'),
                // new Argument([
                //     '--username',
                //     '${auth_player_name}',
                // ]),
                // Argument.fromString('--version ${version_name}'),
                new Argument([
                    '--version',
                    '${version_name}',
                ]),
                // Argument.fromString('--gameDir ${game_directory}'),
                new Argument([
                    '--gameDir',
                    '${game_directory}',
                ]),
                // Argument.fromString('--assetsDir ${assets_root}'),
                new Argument([
                    '--assetsDir',
                    '${assets_root}',
                ]),
                // Argument.fromString('--assetIndex ${assets_index_name}'),
                new Argument([
                    '--assetIndex',
                    '${assets_index_name}',
                ]),
                // Argument.fromString('--uuid ${auth_uuid}'),
                new Argument([
                    '--uuid',
                    '${auth_uuid}',
                ]),
                // Argument.fromString('--accessToken ${auth_access_token}'),
                new Argument([
                    '--accessToken',
                    '${auth_access_token}',
                ]),
                // Argument.fromString('--userType ${user_type}'),
                new Argument([
                    '--userType',
                    '${user_type}',
                ]),
                // Argument.fromString('--versionType ${version_type}'),
                new Argument([
                    '--versionType',
                    '${version_type}',
                ]),
                new Argument([
                    '--demo',
                ], [
                    new Rule(RuleAction.ALLOW, { /* platform */ }, { is_demo_user: true }),
                ]),
                new Argument([
                    '--width',
                    '${resolution_width}',
                    '--height',
                    '${resolution_height}',
                ], [
                    new Rule(RuleAction.ALLOW, { /* platform */ }, { has_custom_resolution: true }),
                ]),
            ],
            [
                new Argument([
                    '-XstartOnFirstThread',
                ], [
                    new Rule(RuleAction.ALLOW, { name: OS.OSX }, { /* features */ }),
                ]),
                new Argument([
                    '-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump',
                ], [
                    new Rule(RuleAction.ALLOW, { name: OS.WINDOWS }, { /* features */ }),
                ]),
                new Argument([
                    '-Dos.name=Windows 10',
                    '-Dos.version=10.0',
                ], [
                    new Rule(RuleAction.ALLOW, { name: OS.WINDOWS, version: '^10\\.' }, { /* features */ }),
                ]),
                new Argument([
                    '-Xss1M',
                ], [
                    new Rule(RuleAction.ALLOW, { arch: 'x86' }, { /* features */ }),
                ]),
                new Argument([
                    '-Djava.library.path=${natives_directory}',
                ]),
                new Argument([
                    '-Dminecraft.launcher.brand=${launcher_name}',
                ]),
                new Argument([
                    '-Dminecraft.launcher.version=${launcher_version}',
                ]),
                new Argument([
                    '-cp',
                    '${classpath}',
                ]),
            ],
        );

        const mockVersionJsonPath = join('mock', 'versions', '1.14.4', '1.14.4.json');
        const mockVersion = Version.from(await readJson(mockVersionJsonPath));
        const libs = mockVersion.libraries.map(_lib => {
            return Library.from(_lib);
        });
        const assetIndex = {
            id: '1.14',
            sha1: 'd6c94fad4f7a03a8e46083c023926515fc0e551e',
            // size: 226753,
            totalSize: 209234283,
            url: 'https://launchermeta.mojang.com/v1/packages/d6c94fad4f7a03a8e46083c023926515fc0e551e/1.14.json',
            path: '1.14.json',
        };
        /* const version = */ new Version(
            '1.14.4',
            'release',
            '1.14',
            downloads,
            args,
            libs,
            assetIndex,
            'net.minecraft.client.main.Main',
        );

        // console.log(version)

    });

});
