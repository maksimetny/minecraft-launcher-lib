
// export enum Features = { }

export enum Action {
    ALLOW = 'allow',
    DISALLOW = 'disallow',
}

import { Platform, IPlatform } from '../platform';

export interface IRule {
    action: Action;
    os: Partial<IPlatform>;
    features: Record<string, boolean>;
}

export class Rule implements IRule {

    static from(_rule: Partial<IRule>, _default: Partial<IRule> = { /* default */ }): Rule {
        if (_rule instanceof Rule) {
            return _rule;
        }

        const {
            action: defaultAction = Action.ALLOW,
            os: defaultOS = { /* platform */ },
            features: defaultFeatures = { /* features */ },
        } = _default;

        const {
            action = defaultAction,
            os = defaultOS,
            features = defaultFeatures,
        } = _rule;

        return new Rule(action, os, features);
    }

    static compare(a: boolean, b: boolean, action: Action): boolean {
        switch (action) {
            case Action.ALLOW: return a;
            default: return b;
        }
    }

    constructor(
        private _action: Action,
        private _os: Partial<IPlatform>,
        private _features: Record<string, boolean>,
    ) { }

    get action(): Action {
        return this._action;
    }

    get os(): Partial<IPlatform> {
        return this._os;
    }

    get features(): Record<string, boolean> {
        return this._features;
    }

    /**
     * Check if rule are acceptable in certain
     * platform and features.
     */
    isAllowable(platform: Partial<IPlatform>, features: Record<string, boolean>): boolean {
        let allowable = true;

        {
            if (this.os.name) {
                const { name = Platform.current.name } = platform;
                const { name: _name } = this.os;

                allowable = Rule.compare(_name === name, _name !== name, this.action);
            }

            if (this.os.version) {
                const { version = Platform.current.version } = platform;
                const { version: _version } = this.os;

                const a: boolean = Boolean(version.match(_version));
                const b: boolean = !version.match(_version);

                allowable = Rule.compare(a, b, this.action);
            }

            if (this.os.arch) {
                const { arch = Platform.current.arch } = platform;
                const { arch: _arch } = this.os;

                allowable = Rule.compare(_arch === arch, _arch !== arch, this.action);
            }
        } // compare platform

        {
            Object.entries(this.features).forEach(([feature, value]) => {
                allowable = Rule.compare(features[feature] === value, features[feature] !== value, this.action);
            });
        } // compare features

        return allowable;
    }

    getFeature(name: string): boolean {
        return this.features[name];
    }

    setFeature(name: string, value: boolean): boolean {
        return this.features[name] = value;
    }

    toJSON(): IRule {
        const {
            action,
            os,
            features,
        } = this;
        return {
            action,
            os,
            features,
        };
    }

}
