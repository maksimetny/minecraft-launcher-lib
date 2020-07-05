
import { Rule, IRule, Action } from './rule'
import { OS } from '../util'

describe('Rule', () => {

    describe('#resolve', () => {

        it('should be able to replace missing properties with default properties', () => {
            const [rule] = Rule.resolve([{ action: Action.ALLOW }])
            expect(rule.action).toBeTruthy()
            expect(rule.os).toBeTruthy()
            expect(rule.features).toBeTruthy()
        })

    })

    describe('#isAllowable', () => {

        it('should return `false` if rule excludes osx only when os = osx', () => {
            const rules: Partial<IRule>[] = [
                {
                    action: Action.ALLOW
                },
                {
                    action: Action.DISALLOW,
                    os: {
                        name: OS.OSX
                    }
                }
            ] // exclude osx

            const truthy = Rule.isAllowable(rules, { name: OS.WINDOWS }, {})
            expect((truthy)).toBeTruthy()

            const falsy = Rule.isAllowable(rules, { name: OS.OSX }, {})
            expect((falsy)).toBeFalsy()
        })

        it('should return `true` if rule includes osx only when os = osx', () => {
            const rules = [
                {
                    action: Action.ALLOW,
                    os: {
                        name: OS.OSX
                    }
                }
            ] // only macos

            const truthy = Rule.isAllowable(rules, { name: OS.OSX }, {})
            expect((truthy)).toBeTruthy()

            const falsy = Rule.isAllowable(rules, { name: OS.WINDOWS }, {})
            expect((falsy)).toBeFalsy()
        })

    })

    describe('#setFeature', () => {

        it('should add a new feature to features', () => {
            // const rule = Rule.resolve({ action: Action.ALLOW })
            const [rule] = Rule.resolve([{ action: Action.ALLOW }])
            rule.setFeature('is_demo', true)
            expect(rule.features.is_demo).toBeTruthy()
        })

    })

    // describe('#toJSON', () => {

    //     it('should move instance to json', () => {
    //         const [rule] = Rule.resolve([{ action: Action.ALLOW }])
    //         const s = rule.toJSON()
    //         // expect(typeof s).toBe('string')
    //         expect((JSON.parse(s) as IRule).action).toBe('allow')
    //     })

    // })

})
