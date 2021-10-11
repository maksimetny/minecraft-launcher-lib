
import { Platform, IPlatform } from '../platform';

export enum RuleAction {
    ALLOW = 'allow',
    DISALLOW = 'disallow',
}

export interface IRule {

    action: RuleAction;

    /**
     * The required platform.
     */
    os: Partial<IPlatform>;

    /**
     * The enabled or disabled features.
     */
    features: Record<string, unknown>;

}

export class Rule implements IRule {

    static from(child: Partial<IRule>, parent?: Partial<IRule>): Rule {
        if (!parent) {
            if (child instanceof Rule) return child;
            parent = {};
        }

        return new Rule(
            child.action,
            Object.assign({}, parent.os, child.os),
            Object.assign({}, parent.features, child.features),
        );
    }

    static sanitizeFeatures(features: Record<string, unknown>): Record<string, boolean> {
        return Object.fromEntries(Object.entries(features).map(([feature, value]) => [feature, Boolean(value)]));
    }

    constructor(
        public action = RuleAction.ALLOW,
        public os: Partial<IPlatform> = {},
        public features: Record<string, unknown> = {},
    ) { }

    /**
     * Compare the current platform and enabled features with params and features
     * of this rule required for this rule to take action.
     *
     * @param platform The current platform.
     * @param features The enabled or disabled features.
     *
     * @returns The result for this rule.
     */
    isAllowable(
        platform: Partial<IPlatform> = {},
        features: Record<string, unknown> = {},
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

        Object.entries(Rule.sanitizeFeatures(this.features)).forEach(([feature, value]) => {
            allowable = this.compare(
                features[feature] === value,
                features[feature] !== value,
            );
        }); // compare features

        return allowable;
    }

    /**
     * Compare two boolean values using this rule's action.
     */
    compare(a: boolean, b: boolean): boolean {
        switch (this.action) {
            case RuleAction.ALLOW: return a;
            default: return b;
        }
    }

}
