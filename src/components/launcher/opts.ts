
export interface ILauncherOptions { }

export class LauncherOptions implements ILauncherOptions {

    static resolve(opts: ILauncherOptions) {
        if (opts instanceof LauncherOptions) {
            return opts
        } else {
            const {
                //
            } = opts

            return new LauncherOptions()
        }
    }

    constructor(
        //
    ) {
        //
    }

}
