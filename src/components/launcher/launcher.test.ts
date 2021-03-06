
import { join, sep } from 'path'

import {
    currentPlatform,
    Platform,
} from '../platform'

import { Artifact } from '../artifact'
import { Argument } from '../argument'
import { Library, LibraryDownloads } from '../library'
import { Rule, Action } from '../rule'

import {
    Version,
    VersionDownloads,
    VersionArguments,
} from '../version'

import {
    Launcher,
} from './launcher'

describe('Launcher', () => {

    describe('#constructArguments', () => {

        it('should returns valid launch args', () => {
            const version = new Version(
                '1.0',
                'release',
                '1.0',
                new VersionDownloads(
                    new Artifact('example.jar', 'https://example.com/example.jar', '624c22a8c8f8c93f18fe5ecd4713100c8d754507'),
                ),
                new VersionArguments(
                    [
                        Argument.fromString('--username ${auth_player_name}'),
                        new Argument(['--demo'], [
                            new Rule(Action.ALLOW, { /* platform */ }, { is_demo_user: true }),
                        ]),
                    ],
                    [
                        new Argument([
                            '-Djava.library.path=${natives_directory}',
                        ]),
                        new Argument([
                            '-cp',
                            '${classpath}',
                        ]),
                    ],
                ),
                [
                    Library.from({ name: 'com.launcher:auth:2.0' }),
                ],
                {
                    id: '1.14',
                    sha1: 'd6c94fad4f7a03a8e46083c023926515fc0e551e',
                    // size: 226753,
                    totalSize: 209234283,
                    url: 'https://launchermeta.mojang.com/v1/packages/d6c94fad4f7a03a8e46083c023926515fc0e551e/1.14.json',
                    path: '1.14.json',
                },
                'net.minecraft.client.main.Main',
            )

            const args = Launcher.constructArguments({
                user: {
                    accessToken: 'b0fe544269864624b9c4d42366462e74',
                    type: 'legacy',
                    profile: {
                        name: 'dragonhay',
                        id: '358b8199702a4fdd8a7c543eda71b6b0',
                    },
                },
                launcherFolder: 'launcher',
                version,
                extraArgs: new VersionArguments(
                    [Argument.fromString('--extra')],
                    [
                        // this parameter is required when using a new instance of version arguments, because it defaults to DEFAULT_JVM_ARGS, which causes arguments to be repeated in some vars

                        // use `{ game: ['--extra'] }` if you don't need to specify JVM args
                    ],
                ),
                features: {
                    is_demo_user: true,
                },
                overrides: {
                    versionType: 'modified',
                },
            })

            const s = currentPlatform.classpathSeparator

            expect(args).toEqual([
                '-Xmx1024M',
                '-Xms512M',
                '-Dfml.ignorePatchDiscrepancies=true',
                '-Dfml.ignoreInvalidMinecraftCertificates=true',
                `-Djava.library.path=${join('launcher', 'natives', '1.0')}`,
                '-cp',
                [
                    join('launcher', 'libraries', 'com', 'launcher', 'auth', '2.0', 'auth-2.0.jar'),
                    join('launcher', 'versions', '1.0', '1.0.jar'),
                ].join(s),
                'net.minecraft.client.main.Main',
                '--username',
                'dragonhay',
                '--demo',
                '--extra',
            ])
        })

    })

})
