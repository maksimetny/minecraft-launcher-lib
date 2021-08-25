
import { VersionArguments } from './version-arguments';
import { RuleAction } from '../../rule';

describe('VersionArguments', () => {

    describe('#from', () => {

        it('should be able to resolve normal version arguments', () => {
            const { game, jvm } = VersionArguments.from({
                game: [
                    '--username ${auth_player_name}',
                    {
                        rules: [
                            {
                                action: RuleAction.ALLOW,
                                features: {
                                    is_demo_user: true,
                                },
                            },
                        ],
                        value: '--demo',
                    },
                ],
                jvm: [
                    {
                        rules: [
                            {
                                action: RuleAction.ALLOW,
                                os: {
                                    arch: 'x86',
                                },
                            },
                        ],
                        value: '-Xss1M',
                    },
                    '-cp ${classpath}',
                ],
            });

            expect(game[0].value).toEqual(['--username', '${auth_player_name}']);

            expect(game[1].value).toEqual(['--demo']);
            expect(game[1].rules[0].action).toBe('allow');
            expect(game[1].rules[0].features.is_demo_user).toBeTruthy();

            expect(jvm[0].value).toEqual(['-Xss1M']);
            expect(jvm[0].rules[0].action).toBe('allow');
            expect(jvm[0].rules[0].os).toEqual({ arch: 'x86' });
        });

    });

    describe('#fromLegacyArguments', () => {

        it('should convert string game arguments to an array of resolved arguments', () => {
            const minecraftArguments: string = '--username ${auth_player_name}';
            const { game, jvm } = VersionArguments.fromLegacyArguments(minecraftArguments);

            expect(game[0].value).toEqual(['--username', '${auth_player_name}']);
            expect(jvm[jvm.length - 1].value).toEqual(['-cp', '${classpath}']);
        });

    });

});
