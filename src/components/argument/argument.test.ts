
import { Argument } from './argument';
import { Rule, Action } from '../rule';

describe('Argument', () => {

    describe('#from', () => {

        it('should turn string argument into an instance of argument', () => {
            const argument = Argument.from('--demo');
            const [value] = argument.value;
            expect(value).toBe('--demo');
            expect(argument.rules).toBeTruthy();
        });

        it('should turn string argument with two substrings into an instance of argument', () => {
            const argument = Argument.from('--username ${auth_player_name}');
            const [value1, value2] = argument.value;
            expect(value1).toBe('--username');
            expect(value2).toBe('${auth_player_name}');
            expect(argument.rules).toBeTruthy();
        });

    });

    describe('#isApplicable', () => {

        it('should be able to check platform and features', () => {
            const platform = { arch: 'x64' };
            const features = { has_custom_resolution: true };

            const argument1 = new Argument(
                [
                    '--width',
                    '${resolution_width}',
                    '--height',
                    '${resolution_height}',
                ],
                [
                    new Rule(Action.ALLOW, {}, features),
                ],
            );

            const argument2 = new Argument(
                [
                    '-Xss1M',
                ],
                [
                    new Rule(Action.ALLOW, platform, {}),
                ],
            );

            expect(argument1.isApplicable(platform, features)).toBeTruthy();
            expect(argument2.isApplicable(platform, features)).toBeTruthy();
        });

    });

    it('should add new rule', () => {
        const argument = new Argument(['--demo']);
        const rule = Rule.from({ action: Action.ALLOW });
        argument.rules.push(rule);
        expect(argument.rules.length).toBe(1);
    });

});
