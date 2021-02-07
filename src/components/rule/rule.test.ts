
import {
    Action,
    Rule,
    IRule,
} from './rule'

import { OS } from '../platform'

describe('Rule', () => {

    describe('#from', () => {

        it('should be able to replace missing properties with default properties', () => {
            const rule = Rule.from({ action: Action.ALLOW })

            expect(rule.action).toBeTruthy()
            expect(rule.os).toBeTruthy()
            expect(rule.features).toBeTruthy()
        })

    })

    describe('#setFeature', () => {

        it('should add a new feature to features', () => {
            const rule = Rule.from({ action: Action.ALLOW })

            rule.setFeature('is_demo', true)
            expect(rule.features.is_demo).toBeTruthy()
        })

    })

})
