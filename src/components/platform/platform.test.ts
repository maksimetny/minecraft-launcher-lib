
import { Platform, OS, IPlatform } from './platform';
import * as os from 'os';

describe('Platform', () => {

    describe('#from', () => {

        it('should be able to replace missing properties with default properties', () => {
            const defaultPlatform: IPlatform = {
                name: OS.LINUX,
                arch: 'x64',
                version: 'release',
            };
            const platform = Platform.from({ /* target */ }, defaultPlatform);

            expect(platform.version).toBe(defaultPlatform.version);
            expect(platform.name).toBe(defaultPlatform.name);
            expect(platform.arch).toBe(defaultPlatform.arch);
        });

    });

    describe('#current', () => {

        it('returns current platform name', () => {
            const { name }: Platform = Platform.current;
            let expectedName: string;

            switch (os.platform()) {
                case 'win32': {
                    expectedName = OS.WINDOWS;
                    break;
                }
                case 'darwin': {
                    expectedName = OS.OSX;
                    break;
                }
                default: {
                    expectedName = OS.LINUX;
                    break;
                } // linux and unknown
            }

            expect(name).toBe(expectedName);
        });

        it('returns current platform arch', () => {
            const { arch }: Platform = Platform.current;
            expect(arch).toBe(os.arch());
        });

        it('returns current platform version', () => {
            const { version }: Platform = Platform.current;
            expect(version).toBe(os.release());
        });

    });

    describe('#classpathSeparator', () => {

        describe('returns current classpath separator', () => {

            it('on windows', () => {
                const platform: Platform = new Platform(OS.WINDOWS);
                expect(platform.classpathSeparator).toBe(';');
            });

            it('on linux and osx', () => {
                const platform: Platform = new Platform(OS.LINUX);
                expect(platform.classpathSeparator).toBe(':');
            });

        });

    });

});
