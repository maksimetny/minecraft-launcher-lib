
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

    static from(rule: Partial<IRule>, parent: Partial<IRule> = {}): Rule {
        if (rule instanceof Rule) return rule;

        const {
            action = parent.action,
            os = parent.os,
            features = parent.features,
        } = rule;

        return new Rule(
            action,
            os,
            features,
        );
    }

    constructor(
        public action = RuleAction.ALLOW,
        public os: Partial<IPlatform> = {},
        public features: Record<string, boolean> = {},
    ) { }

    /**
     * Compare current platform and features with params
     * required for rule to take action.
     *
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

}
