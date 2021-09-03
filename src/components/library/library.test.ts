
import { readJson } from '../../util';
import { join } from 'path';
import { Library } from './library';
import { OS } from '../platform';
import { MOJANG } from '../../constants/urls';
import { Rule, RuleAction } from '../rule';

describe('Library', () => {

    describe('#from', () => {

        it('should be able to resolve normal library', () => {
            const lib = Library.from({
                downloads: {
                    artifact: {
                        path: 'com/mojang/patchy/1.1/patchy-1.1.jar',
                        url: MOJANG.LIBS_REPO + '/com/mojang/patchy/1.1/patchy-1.1.jar',
                        sha1: 'aef610b34a1be37fa851825f12372b78424d8903',
                    },
                },
                name: 'com.mojang:patchy:1.1',
            });

            {
                const {
                    path,
                    url,
                    sha1,
                } = lib.downloads.artifact;

                expect(path).toBe('com/mojang/patchy/1.1/patchy-1.1.jar');
                expect(url).toBe(MOJANG.LIBS_REPO + '/com/mojang/patchy/1.1/patchy-1.1.jar');
                expect(sha1).toBe('aef610b34a1be37fa851825f12372b78424d8903');
            } // expect artifact

            expect(lib.name).toBe('com.mojang:patchy:1.1');
        });

        it('should be able to resolve minimum library', () => {
            const lib = Library.from({ name: 'com.mojang:patchy:1.1' });

            {
                const { path, url } = lib.downloads.artifact;

                expect(path).toBe('com/mojang/patchy/1.1/patchy-1.1.jar');
                expect(url).toBe(MOJANG.LIBS_REPO + '/com/mojang/patchy/1.1/patchy-1.1.jar');
            } // expect artifact

            expect(lib.name).toBe('com.mojang:patchy:1.1');
        });

        it('should be able to resolve strange library without downloads', async () => {
            const libraryJsonPath = join('mock', 'libraries', 'org', 'lwjgl', 'lwjgl-openal', '3.2.2', 'lwjgl-openal-3.2.2.json');
            const lib = Library.from(await readJson(libraryJsonPath));

            {
                const { [OS.WINDOWS]: classifier } = lib.natives;
                expect(typeof classifier).toBe('string');
                const { path, url } = lib.downloads.classifiers[classifier as string];

                expect(path).toBe('org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-windows.jar');
                expect(url).toBe('https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-windows.jar');

            } // expect classificated native windows artifact

            {
                const { [OS.LINUX]: classifier } = lib.natives;
                expect(typeof classifier).toBe('string');
                const { path, url } = lib.downloads.classifiers[classifier as string];

                expect(path).toBe('org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-linux.jar');
                expect(url).toBe('https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2-natives-linux.jar');
            } // expect classificated native linux artifact

            {
                const { path, url } = lib.downloads.artifact;

                expect(path).toBe('org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.jar');
                expect(url).toBe('https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.jar');
            } // expect artifact
        });

        it('should be able to resolve forge library', () => {
            const lib = Library.from({
                downloads: {
                    artifact: {
                        path: 'net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar',
                        url: 'https://modloaders.forgecdn.net/647622546/maven/net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar',
                        sha1: 'afe6f0d2a5341dfbc3c225208ce64d5684ece8f1',
                    },
                },
                name: 'net.minecraftforge:forge:1.14.4-28.2.0',
            });

            {
                const { path, url, sha1 } = lib.downloads.artifact;

                expect(path).toBe('net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar');
                expect(url).toBe('https://modloaders.forgecdn.net/647622546/maven/net/minecraftforge/forge/1.14.4-28.2.0/forge-1.14.4-28.2.0.jar');
                expect(sha1).toBe('afe6f0d2a5341dfbc3c225208ce64d5684ece8f1');
            } // expect artifact

            expect(lib.name).toBe('net.minecraftforge:forge:1.14.4-28.2.0');
        });

    });

    describe('#isApplicable', () => {

        it('enabled features', () => {
            const enabledFeatures: Record<string, boolean> = { download_only: false };
            const downloadOnly = Rule.from({ action: RuleAction.ALLOW, features: { download_only: true } });

            expect(Library.from({ name: 'com.launcher:auth-lib:1.0', rules: [downloadOnly] }).isApplicable({}, enabledFeatures)).toBeFalsy();
            expect(new Library('com.launcher:auth-core:1.0').isApplicable({}, enabledFeatures)).toBeTruthy();
        });

    });

});
