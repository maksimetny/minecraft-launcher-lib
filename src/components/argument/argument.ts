
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

    rules: IRule[];

}

export class Argument implements IArgument {

    static from(arg: ArgumentValue | Partial<IArgument>): Argument {
        if (arg instanceof Argument) return arg;

        switch (typeof arg) {
            case 'string': break;
            case 'object': {
                if (Array.isArray(arg)) break;
                else if (arg.value) return new Argument(arg.value, arg.rules);
            }
            default: throw new Error('missing argument value');
        }

        return new Argument(arg);
    }

    static format(template: string, fields: Map<string, string>): string {
        return template.replace(/\$\{(.*?)}/g, key => fields.get(key.substring(2).substring(0, key.length - 3)) ?? key);
    } // github.com/voxelum/minecraft-launcher-core-node/blob/3d5aa7a38cbc66cdfc9b9d68a8bdf4988905cb72/packages/core/launch.ts

    private _value: string[];
    private _rules: Rule[];

    constructor(
        value: ArgumentValue,
        rules: Partial<IRule>[] = [],
    ) {
        switch (typeof value) {
            case 'string': {
                this._value = value.split(/\s/g);
                break;
            }
            case 'object': {
                if (Array.isArray(value)) {
                    this._value = value;
                    break;
                }
            }
            default: throw new Error('argument value is not string or string array');
        }

        this._rules = rules.map(rule => Rule.from(rule));
    }

    get value(): string[] {
        return this._value;
    }

    get rules(): Rule[] {
        return this._rules;
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

    toJSON(): IArgument {
        const {
            value,
            rules,
        } = this;
        return {
            value,
            rules,
        };
    }

}

export type ArgumentValue = string | string[];
