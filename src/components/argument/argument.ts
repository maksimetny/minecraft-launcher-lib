
import { Rule, IRule } from '../rule';
import { IPlatform } from '../platform';

export interface IArgument {

    /**
     * An argument or a args list.
     */
    value: string | string[];

    rules: Array<Partial<IRule>>;

}

export class Argument implements IArgument {

    static from(child: IArgument['value'] | Partial<IArgument>, parent?: Partial<IArgument>): Argument {
        if (!parent) {
            if (child instanceof Argument) return child;
            parent = {};
        }

        switch (typeof child) {
            case 'string': break;
            case 'object': {
                if (Array.isArray(child)) break;

                // TODO child arg' rules extends parent arg rules

                const {
                    value,
                    rules = parent.rules,
                } = child;

                if (value) return new Argument(value, rules);
            }
            default: throw new Error('missing argument value');
        }

        return new Argument(child, parent.rules);
    }

    static format(template: string, fields: Map<string, string>): string {
        return template.replace(/\$\{(.*?)}/g, key => fields.get(key.substring(2).substring(0, key.length - 3)) ?? key);
    } // github.com/voxelum/minecraft-launcher-core-node/blob/3d5aa7a38cbc66cdfc9b9d68a8bdf4988905cb72/packages/core/launch.ts

    public value: string[];
    public rules: Rule[];

    constructor(
        value: IArgument['value'],
        rules: Partial<IRule>[] = [],
    ) {
        this.value = Array.isArray(value) ? value : value.split(/\s/g);
        this.rules = rules.map(rule => Rule.from(rule));
    }

    /**
     * Checks if this argument is applicable to the current platform and features.
     *
     * @param platform The current platform.
     * @param features The current featutes.
     *
     * @returns Is argument applicable?
     */
    isApplicable(platform: Partial<IPlatform>, features: Record<string, unknown> = {}): boolean {
        return !this.rules.map(rule => rule.isAllowable(platform, features)).includes(false);
    }

    /**
     * Formats and returns this argument as a string.
     */
    format(fields: Map<string, string>): string[] {
        return this.value.map(value => Argument.format(value, fields));
    }

    toString(): string {
        return this.value.join(' ');
    }

    toJSON(): string | IArgument {
        const value = this.toString();
        const rules = this.rules;
        return (rules.length) ? { value, rules } : value;
    }

}
