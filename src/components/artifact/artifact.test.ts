
import { Artifact } from './artifact';
import { MOJANG } from '../../constants/urls';

describe('Artifact', () => {

    describe('#from', () => {

        it('should be able to resolve artifact from artifact id', () => {
            const {
                path,
                url,
            } = Artifact.from('com.mojang:patchy:1.1');

            expect(path).toBe('com/mojang/patchy/1.1/patchy-1.1.jar');
            expect(url).toBe(MOJANG.LIBS_REPO + '/com/mojang/patchy/1.1/patchy-1.1.jar');
        });

        it('should be able to resolve artifact from artifact id with custom extension', () => {
            const {
                path,
                url,
            } = Artifact.from('com.mojang:patchy:1.1@lzma');

            expect(path).toBe('com/mojang/patchy/1.1/patchy-1.1.lzma');
            expect(url).toBe(MOJANG.LIBS_REPO + '/com/mojang/patchy/1.1/patchy-1.1.lzma');
        });

        it('should be able to resolve artifact from artifact id with classifier', () => {
            const {
                path,
                url,
            } = Artifact.from('org.lwjgl:lwjgl-jemalloc:3.2.1:sources');
            expect(path).toBe('org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-sources.jar');
            expect(url).toBe(MOJANG.LIBS_REPO + '/org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-sources.jar');
        });

        it('should be able to resolve artifact from artifact id with classifier and custom extension', () => {
            const {
                path,
                url,
            } = Artifact.from('org.lwjgl:lwjgl-jemalloc:3.2.1:sources@tar.xz');
            expect(path).toBe('org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-sources.tar.xz');
            expect(url).toBe(MOJANG.LIBS_REPO + '/org/lwjgl/lwjgl-jemalloc/3.2.1/lwjgl-jemalloc-3.2.1-sources.tar.xz');
        });

        it('should be able to resolve artifact from normal artifact object', () => {
            const {
                path,
                sha1,
                size,
                url,
            } = Artifact.from({
                path: 'com/mojang/patchy/1.1/patchy-1.1.jar',
                sha1: 'aef610b34a1be37fa851825f12372b78424d8903',
                size: 15817,
                url: MOJANG.LIBS_REPO + '/com/mojang/patchy/1.1/patchy-1.1.jar',
            });

            expect(path).toBe('com/mojang/patchy/1.1/patchy-1.1.jar');
            expect(sha1).toBe('aef610b34a1be37fa851825f12372b78424d8903');
            expect(size).toBe(15817);
            expect(url).toBe(MOJANG.LIBS_REPO + '/com/mojang/patchy/1.1/patchy-1.1.jar');
        });

    });

    describe('#toString', () => {

        it('should transform artifact to artifact id', () => {
            const artifact = new Artifact(
                'com/mojang/patchy/1.1/patchy-1.1.jar',
                MOJANG.LIBS_REPO + '/com/mojang/patchy/1.1/patchy-1.1.jar',
                15817,
                'aef610b34a1be37fa851825f12372b78424d8903',
            );
            expect(artifact.toString()).toBe('com.mojang:patchy:1.1@jar');
        });

    });

});
