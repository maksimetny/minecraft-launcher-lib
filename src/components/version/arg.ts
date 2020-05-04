
import { Rule, IRule, Features } from './rule'
import { IPlatform } from '../util'

export interface IArgument {

    /**
     * An argument or a list of args that is
     * added when condition is matched.
     */
    value: string[] | string

    /**
     * Rules of applicable.
     */
    rules: IRule[]

}

export class Argument {

    static resolve(args: Partial<IArgument>[]) {
        return args.map(arg => {
            if (arg instanceof Argument) {
                return arg
            } else {
                switch (typeof arg.value) {
                    case 'string': {
                        return Argument.fromString(arg.value)
                    }
                    case 'object': {
                        if (arg.value instanceof Array) {
                            const { rules: _rules = [] } = arg
                            return new Argument(arg.value, Rule.resolve(_rules))
                        }
                    }
                    default: {
                        throw new Error('argument value not string or string array')
                    }
                }
            }
        })
    }

    static fromString(value: string) {
        return new Argument([
            value
        ])
    }

    static format(template: string, fields: Fields) {
        return template.replace(/\$\{(.*?)}/g, key => {
            const value = fields[key.substring(2).substring(0, key.length - 3)]
            if (value) { return value } else { return key }
        })
    } // https://github.com/voxelum/minecraft-launcher-core-node/blob/3d5aa7a38cbc66cdfc9b9d68a8bdf4988905cb72/packages/core/launch.ts

    constructor(readonly value: string[], readonly rules: Rule[] = []) { }

    isApplicable(platform: Partial<IPlatform>, features: Features) {
        return Rule.isAllowable(this.rules, platform, features)
    }

    format(fields: Fields) {
        return this.value.map(value => {
            return Argument.format(value, fields)
        })
    }

    // addRule(rule: Partial<IRule>) {
    //     const _rule = Rule.resolve(rule)
    //     this.rules.push(_rule)
    //     // return this
    // }

}

export type Fields = { [index: string]: string }
