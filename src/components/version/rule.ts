
export type Features = { [feature: string]: boolean }

export enum Action { ALLOW = 'allow', DISALLOW = 'disallow' }

import {
    currentPlatform,
    Platform,
    IPlatform
} from '../util'

export interface IRule {
    action: Action
    os?: Partial<IPlatform>
    features?: Features
}

export class Rule implements IRule {

    static resolve(_rules: Partial<IRule>[], _default: Partial<IRule> = { /* default */ }) {
        return _rules.map(_rule => {
            if (_rule instanceof Rule) {
                return _rule
            } else {
                const {
                    action: defaultAction = Action.ALLOW,
                    os: defaultOS = { /* platform */ },
                    features: defaultFeatures = { /* features */ }
                } = _default

                const {
                    action = defaultAction,
                    os = defaultOS,
                    features = defaultFeatures
                } = _rule

                return new Rule(action, features, os)
            }
        })
    }

    static comparator(a: boolean, b: boolean, action: Action) {
        switch (action) {
            case Action.ALLOW: return a
            default: return b
        }
    }

    static isAllowable(rules: Partial<IRule>[], platform: Partial<IPlatform>, features: Features) {
        return !this.resolve(rules).map(rule => {
            return rule.isAllowable(platform, features)
        }).includes(false)
    }

    constructor(readonly action: Action, readonly features: Features, readonly os: Partial<IPlatform>) { }

    /**
     * Check if rule are acceptable in certain
     * platform and features.
     */
    isAllowable(platform: Partial<IPlatform>, features: Features) {
        let allowable = true

        {
            if (this.os.name) {
                const { name = currentPlatform.name } = platform
                const { name: _name } = this.os

                allowable = Rule.comparator(_name === name, _name !== name, this.action)
            }

            if (this.os.version) {
                const { version = currentPlatform.version } = platform
                const { version: _version } = this.os

                const a: boolean = Boolean(version.match(_version))
                const b: boolean = !version.match(_version)

                allowable = Rule.comparator(a, b, this.action)
            }

            if (this.os.arch) {
                const { arch = currentPlatform.arch } = platform
                const { arch: _arch } = this.os

                allowable = Rule.comparator(_arch === arch, _arch !== arch, this.action)
            }
        } // compare platform

        {
            Object.entries(this.features).forEach(([feature, value]) => {
                allowable = Rule.comparator(features[feature] === value, features[feature] !== value, this.action)
            })
        } // compare features

        return (allowable)
    }

    setFeature(name: string, value: boolean) {
        this.features[name] = value
        return this
    }

}
