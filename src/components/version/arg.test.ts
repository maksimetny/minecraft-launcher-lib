
import { Argument } from './arg'
import {
    Action,
    Rule
} from './rule'

describe('Argument', () => {

    // describe('#resolve', () => {

    // })

    describe('#fromString', () => {

        it('should turn string argument into an instance of argument', () => {
            const arg = Argument.fromString('--demo')
            expect((arg).value).toBeTruthy()
            expect((arg).rules).toBeTruthy()
        })

    })

    describe('#isApplicable', () => {

        it('should be able to check platform and features', () => {
            const platfrom = { arch: 'x86' }
            const features = { has_custom_resolution: true }

            expect(new Argument([
                '--width',
                '${resolution_width}',
                '--height',
                '${resolution_height}'
            ], [
                new Rule(Action.ALLOW, features, {
                    // platform
                })
            ]).isApplicable(platfrom, features)).toBeTruthy()

            expect(new Argument([
                '-Xss1M'
            ], [
                new Rule(Action.ALLOW, {
                    // features
                }, platfrom)
            ]).isApplicable(platfrom, features)).toBeTruthy()
        })

    })

    // describe('#addRule', () => {

    //     it('should add new rule', () => {
    //         const arg = new Argument(['--demo'], [])
    //         arg.addRule({ action: Action.ALLOW })
    //         expect((arg).rules.length).toBe(1)
    //     })

    // })

})
