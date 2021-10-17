
import { Rule, RuleAction } from './rule';
import {
    Platform,
    OS,
} from '../platform';

describe('Rule', () => {

    describe('#from', () => {

        it('should be able to replace child missing properties with parent properties', () => {
            const {
                action,
                os,
            } = Rule.from(
                {
                    action: RuleAction.DISALLOW,
                    os: { name: OS.OSX },
                },
                {
                    os: { arch: 'arm' },
                },
            );

            expect(action).toBe('disallow');
            expect(os.name).toBe(OS.OSX);
            expect(os.arch).toBe('arm');
        });

    });

    describe('#isAllowable', () => {

        it('should exclude disallowed platforms', () => {
            const rule: Rule = Rule.from({
                action: RuleAction.DISALLOW,
                os: {
                    name: OS.WINDOWS,
                },
            });
            const platform1: Platform = new Platform(OS.WINDOWS);
            const platform2: Platform = new Platform(OS.LINUX);

            expect(rule.isAllowable(platform1)).toBeFalsy();
            expect(rule.isAllowable(platform2)).toBeTruthy();
        });

        it('should include allowed platforms', () => {
            const rule: Rule = Rule.from({
                action: RuleAction.ALLOW,
                os: { name: OS.WINDOWS, version: '^10\\.' },
            });
            const platform1: Platform = Platform.from({ name: OS.WINDOWS, version: '10.0' });
            const platform2: Platform = Platform.from({ name: OS.WINDOWS, version: '11.0' });

            expect(rule.isAllowable(platform1)).toBeTruthy();
            expect(rule.isAllowable(platform2)).toBeFalsy();
        });

        it('should exclude disallowed features', () => {
            const rule: Rule = Rule.from({
                action: RuleAction.DISALLOW,
                features: {
                    has_fullscreen: true,
                },
            });

            expect(rule.isAllowable({}, { has_fullscreen: true })).toBeFalsy();
            expect(rule.isAllowable()).toBeTruthy();
        });

        it('should include allowed features', () => {
            const rule: Rule = Rule.from({
                action: RuleAction.ALLOW,
                features: {
                    is_demo_user: true,
                },
            });

            expect(rule.isAllowable({}, { is_demo_user: true })).toBeTruthy();
            expect(rule.isAllowable()).toBeFalsy();
        });

    });

});
