
export enum RuleAction {
    ALLOW = 'allow',
    DISALLOW = 'disallow',
}

import { Platform, IPlatform } from '../platform';

export interface IRule {

    action: RuleAction;

    /**
     * Required platform.
     */
    os: Partial<IPlatform>;

    features: Record<string, boolean>;

}

export class Rule implements IRule {

    static from(rule: Partial<IRule>, def: Partial<IRule> = {}): Rule {
        if (rule instanceof Rule) return rule;

        const {
            action = def.action,
            os = def.os,
            features = def.features,
        } = rule;

        return new Rule(action, os, features);
    }

    private _action: RuleAction;
    private _os: Partial<IPlatform>;
    private _features: Record<string, boolean>;

    constructor(
        action = RuleAction.ALLOW,
        os: Partial<IPlatform> = {},
        features: Record<string, boolean> = {},
    ) {
        this._action = action;
        this._os = os;
        this._features = features;
    }

    get action(): RuleAction {
        return this._action;
    }

    get os(): Partial<IPlatform> {
        return this._os;
    }

    get features(): Record<string, boolean> {
        return this._features;
    }

    /**
     * Compare current platform and features with params
     * required for rule to take action.
     * @param platform Current platform.
     * @param features Enabled or disabled features.
     */
    isAllowable(
        platform: Partial<IPlatform> = {},
        features: Record<string, boolean> = {},
    ): boolean {
        const currentPlatform = Platform.from(platform);
        let allowable = true;

        {
            if (this.os.name) {
                allowable = this.compare(
                    this.os.name === currentPlatform.name,
                    this.os.name !== currentPlatform.name,
                );
            }

            if (this.os.version) {
                const result = currentPlatform.version.match(this.os.version);
                allowable = this.compare(
                    Boolean(result),
                    !result,
                );
            }

            if (this.os.arch) {
                allowable = this.compare(
                    this.os.arch === currentPlatform.arch,
                    this.os.arch !== currentPlatform.arch,
                );
            }
        } // compare platform

        {
            Object
                .entries(this.features)
                .forEach(([feature, value]) => {
                    allowable = this.compare(
                        features[feature] === value,
                        features[feature] !== value,
                    );
                });
        } // compare features

        return allowable;
    }

    compare(a: boolean, b: boolean): boolean {
        switch (this.action) {
            case RuleAction.ALLOW: return a;
            default: return b;
        }
    }

    getFeatureValue(name: string): boolean {
        return this.features[name];
    }

    setFeatureValue(name: string, value: boolean): boolean {
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
