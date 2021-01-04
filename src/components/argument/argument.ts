
import {
    Rule,
    IRule,
} from '../rule'

import {
    IPlatform,
} from '../platform'

export interface IArgument {

    /**
     * An argument or a list of args that is
     * added when condition is matched.
     */
    value: ArgumentValue

    rules: IRule[]

}

export class Argument {

    static STRING_ARG_SEP = String.fromCharCode(160)

    static from(_arg: Partial<IArgument>) {
        if (_arg instanceof Argument) {
            return _arg
        }

        const value: string[] = []
        const {
            rules: _rules = [],
            value: _value,
        } = _arg

        switch (typeof _value) {
            case 'string': {
                value.push(_value)
                break
            }
            case 'object': {
                if (_arg.value instanceof Array) {
                    value.push(..._value)
                    break
                }
            }
            default: {
                throw new Error('argument value not string or string array')
            }
        }

        const rules: Rule[] = _rules.map(_rule => Rule.from(_rule))
        return new Argument(value, rules)
    }

    static fromString(value: string) {
        return new Argument(value.split(/\s/g))
    }

    static format(template: string, fields: Map<string, string>) {
        return template.replace(/\$\{(.*?)}/g, key => {
            return fields.get(key.substring(2).substring(0, key.length - 3)) ?? key
        })
    } // https://github.com/voxelum/minecraft-launcher-core-node/blob/3d5aa7a38cbc66cdfc9b9d68a8bdf4988905cb72/packages/core/launch.ts

    constructor(
        private _value: string[],
        private _rules: Rule[] = [],
    ) { }

    get value() {
        return this._value
    }

    get rules() {
        return this._rules
    }

    isApplicable(platform: Partial<IPlatform>, features: Record<string, boolean> = { /* features */ }): boolean {
        return !this.rules.map(rule => {
            return rule.isAllowable(platform, features)
        }).includes(false)
    }

    format(fields: Map<string, string>) {
        return this.value.map(value => Argument.format(value, fields))
    }

    toString(): string {
        return this.value.join(Argument.STRING_ARG_SEP)
    }

    toJSON(): IArgument {
        const {
            value,
            rules,
        } = this

        return {
            value,
            rules,
        }
    }

}

export type ArgumentValue = string[] | string
