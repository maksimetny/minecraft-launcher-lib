
/** Mojang friendly OS name. */
export enum OS {
    WINDOWS = 'windows',
    LINUX = 'linux',
    OSX = 'osx',
}

export interface IPlatform {
    arch: string;
    name: OS;
    version: string;
}

import * as os from 'os';

export class Platform implements IPlatform {

    static from(platform: Partial<IPlatform>, parent: Partial<IPlatform> = Platform.current): Platform {
        if (platform instanceof Platform) return platform;

        const {
            version = parent.version,
            name = parent.name,
            arch = parent.arch,
        } = platform;

        return new Platform(
            name,
            arch,
            version,
        );
    }

    static friendlifyNodePlatform(platform: NodeJS.Platform): OS {
        switch (platform) {
            case 'win32': return OS.WINDOWS;
            case 'darwin': {
                return OS.OSX;
            }
            default: return OS.LINUX;
        }
    }

    static get current(): Platform {
        return Platform._current ? Platform._current : Platform._current = new Platform();
    }

    private static _current: Platform;

    constructor(
        public name: OS = Platform.friendlifyNodePlatform(os.platform()),
        public arch: string = os.arch(),
        public version: string = os.release(),
    ) { }

    get classpathSeparator(): string {
        return (this.name !== OS.WINDOWS) ? ':' : ';';
    }

}
