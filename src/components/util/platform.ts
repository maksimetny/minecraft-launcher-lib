
export enum OS { WINDOWS = 'windows', LINUX = 'linux', OSX = 'osx' } // mojang friendly OS

export interface IPlatform {
    arch: string
    name: OS
    version: string
}

import * as _os from 'os'

export class Platform implements IPlatform {

    static getCurrentPlatformName(): OS {
        switch (process.platform) {
            case 'win32': {
                return OS.WINDOWS
            }
            case 'darwin': {
                return OS.OSX
            }
            default: {
                return OS.LINUX
            } // linux and other (unknown)..
        }
    }

    static getCurrentPlatformArch(): string { return _os.arch() }

    static getCurrentPlatformVersion(): string { return _os.release() }

    static getCurrentPlatformSeparator(os = currentPlatform.name): string {
        switch (os) {
            case OS.WINDOWS: return ';'
            default: return ':'
        }
    }

    constructor(
        readonly name = Platform.getCurrentPlatformName(),
        readonly arch = Platform.getCurrentPlatformArch(),
        readonly version = Platform.getCurrentPlatformVersion()
    ) { }

}

export const currentPlatform = new Platform()
