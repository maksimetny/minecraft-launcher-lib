
import { VersionArguments } from './version-arguments';
import { RuleAction } from '../../rule';

describe('VersionArguments', () => {

    describe('#from', () => {

        it('should be able to resolve normal version arguments', () => {
            const args = VersionArguments.from({
                game: [
                    '--username ${auth_player_name}',
                    {
                        rules: [
                            { action: RuleAction.ALLOW, features: { is_demo_user: true } },
                        ],
                        value: '--demo',
                    },
                ],
                jvm: [
                    {
                        rules: [
                            { action: RuleAction.ALLOW, os: { arch: 'x86' } },
                        ],
                        value: '-Xss1M',
                    },
                    '-cp ${classpath}',
                ],
            });

            const [username, demo] = args.game;
            const [opt, cp] = args.jvm;

            expect(username.value).toEqual(['--username', '${auth_player_name}']);
            expect(cp.value).toEqual(['-cp', '${classpath}']);

            {
                expect(demo.value).toEqual(['--demo']);

                const [rule] = demo.rules;
                expect(rule.action).toBe('allow');
                expect(rule.features.is_demo_user).toBeTruthy();
            }

            {
                expect(opt.value).toEqual(['-Xss1M']);

                const [rule] = opt.rules;
                expect(rule.action).toBe('allow');
                expect(rule.os).toEqual({ arch: 'x86' });
            }
        });

    });

    describe('#fromLegacyArguments', () => {

        it('should convert string game arguments to an array of resolved arguments', () => {
            const minecraftArguments = '--username ${auth_player_name}';
            const args = VersionArguments.fromLegacyArguments(minecraftArguments);
            const [argument] = args.game;

            expect(argument.value).toEqual(minecraftArguments.split(' '));
        });

    });

});
