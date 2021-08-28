
import { Rule, IRule } from '../rule';
import {
    IPlatform,
} from '../platform';

export interface IArgument {

    /**
     * An argument or a list of args that is
     * added when condition is matched.
     */
    value: ArgumentValue;

    rules: Partial<IRule>[];

}

export class Argument implements IArgument {

    static from(arg: ArgumentValue | Partial<IArgument>, parent: Partial<IArgument> = {}): Argument {
        if (arg instanceof Argument) return arg;

        switch (typeof arg) {
            case 'string': break;
            case 'object': {
                if (Array.isArray(arg)) break;

                const {
                    value,
                    rules = parent.rules,
                } = arg;

                if (value) return new Argument(value, rules);
            }
            default: throw new Error('missing argument value');
        }

        return new Argument(arg, parent.rules);
    }

    static format(template: string, fields: Map<string, string>): string {
        return template.replace(/\$\{(.*?)}/g, key => fields.get(key.substring(2).substring(0, key.length - 3)) ?? key);
    } // github.com/voxelum/minecraft-launcher-core-node/blob/3d5aa7a38cbc66cdfc9b9d68a8bdf4988905cb72/packages/core/launch.ts

    public value: string[];
    public rules: Rule[];

    constructor(
        value: ArgumentValue,
        rules: Partial<IRule>[] = [],
    ) {
        this.value = Array.isArray(value) ? value : value.split(/\s/g);
        this.rules = rules.map(rule => Rule.from(rule));
    }

    isApplicable(platform: Partial<IPlatform>, features: Record<string, boolean> = {}): boolean {
        return !this.rules.map(rule => rule.isAllowable(platform, features)).includes(false);
    }

    format(fields: Map<string, string>): string[] {
        return this.value.map(value => Argument.format(value, fields));
    }

    toString(): string {
        return this.value.join(' ');
    }

    toJSON(): ArgumentValue | IArgument {
        const rules = this.rules;
        const value = this.value.length > 2 ? this.value : this.toString();
        return rules.length ? { value, rules } : value;
    }

}

export type ArgumentValue = string | string[];
