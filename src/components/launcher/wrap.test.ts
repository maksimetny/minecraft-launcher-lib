
import { Launcher } from './wrap'
import {
    Version,
    Library,
    VersionDownloads,
    VersionArguments,
    Artifact,
    Argument,
    Rule,
    Action
} from '../version'
import { Platform } from '../util'

describe('Launcher', () => {

    describe('#generateArguments', () => {

        it('should returns valid launch args', () => {
            const args = Launcher.generateArguments({
                user: {
                    accessToken: 'b0fe544269864624b9c4d42366462e74',
                    type: 'legacy',
                    profile: {
                        name: 'dragonhay',
                        id: '358b8199702a4fdd8a7c543eda71b6b0'
                    }
                },
                directory: 'launcher',
                version: new Version(
                    '1.0',
                    'release',
                    '1.0',
                    new VersionDownloads(new Artifact('https://example.com/example.jar', 'example.jar', '624c22a8c8f8c93f18fe5ecd4713100c8d754507')),
                    new VersionArguments([
                        Argument.fromString('--username ${auth_player_name}'),
                        new Argument([
                            '--demo'
                        ], [
                            new Rule(Action.ALLOW, { is_demo_user: true }, { /* platform */ })
                        ])
                    ], [
                        new Argument([
                            '-Djava.library.path=${natives_directory}'
                        ]),
                        new Argument([
                            '-cp', '${classpath}'
                        ])
                    ]),
                    [
                        Library.resolve([
                            { name: 'com.ulauncher:auth:2.0' }
                        ])[0]
                    ],
                    'net.minecraft.client.main.Main'
                ),
                extraArgs: [
                    '--demo'
                ],
                overrides: { versionType: 'modified' }
            })
            const s = Platform.getSeparator()

            expect((args)).toEqual([
                '-Xmx1024M',
                '-Xms512M',
                '-Djava.library.path=launcher\\natives\\1.0',
                '-cp',
                ['launcher\\libraries\\com\\ulauncher\\auth\\2.0\\auth-2.0.jar', 'launcher\\1.0.jar'].join(s),
                'net.minecraft.client.main.Main', '--username', 'dragonhay', '--demo'
            ])
        })

    })

})
