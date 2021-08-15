
import {
    Argument,
} from './argument'

import {
    Action,
    Rule,
} from '../rule'

describe('Argument', () => {

    describe('#fromString', () => {

        it('should turn string argument into an instance of argument', () => {
            const argument = Argument.fromString('--demo')
            expect(argument.value).toBeTruthy()
            expect(argument.rules).toBeTruthy()
        })

    })

    describe('#isApplicable', () => {

        it('should be able to check platform and features', () => {
            const platform = { arch: 'x86' }
            const features = { has_custom_resolution: true }

            const argument_1 = new Argument([
                '--width',
                '${resolution_width}',
                '--height',
                '${resolution_height}',
            ], [
                new Rule(Action.ALLOW, {
                    // platform
                }, features)
            ])

            const argument_2 = new Argument([
                '-Xss1M',
            ], [
                new Rule(Action.ALLOW, platform, {
                    // features
                })
            ])

            expect(argument_1.isApplicable(platform, features)).toBeTruthy()
            expect(argument_2.isApplicable(platform, features)).toBeTruthy()
        })

    })

    it('should add new rule', () => {
        const argument = new Argument(['--demo'])
        const rule = Rule.from({ action: Action.ALLOW })
        argument.rules.push(rule)
        expect(argument.rules.length).toBe(1)
    })

})
