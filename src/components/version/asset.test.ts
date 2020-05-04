
import * as asset from './asset'
import { join } from 'path'

describe('Asset', () => {

    const { objects } = {
        objects: {
            'icons/icon_16x16.png': {
                hash: 'bdf48ef6b5d0d23bbb02e17d04865216179f510a',
                // size: 3665
            },
            'icons/icon_32x32.png': {
                hash: '92750c5f93c312ba9ab413d546f32190c56d6f1f',
                // size: 5362
            },
            'icons/minecraft.icns': {
                hash: '991b421dfd401f115241601b2b373140a8d78572',
                // size: 114786
            }
        }
    } as {
        objects: {
            [path: string]: { hash: string }
        }
    }

    describe('#subhash', () => {

        const subhashes = {
            'bdf48ef6b5d0d23bbb02e17d04865216179f510a': 'bd',
            '92750c5f93c312ba9ab413d546f32190c56d6f1f': '92',
            '991b421dfd401f115241601b2b373140a8d78572': '99'
        } as { [hash: string]: string }

        it('should returns subhash', () => {
            Object.keys(objects).forEach(path => {
                const { hash } = objects[path]
                const { subhash } = new asset.Asset(path, hash)
                expect((subhash)).toBe(subhashes[hash])
            })
        })

    })

    describe('#getPath', () => {

        it('should returns path to asset', () => {
            const paths = {
                'bdf48ef6b5d0d23bbb02e17d04865216179f510a': join('objects', 'bd', 'bdf48ef6b5d0d23bbb02e17d04865216179f510a'),
                '92750c5f93c312ba9ab413d546f32190c56d6f1f': join('objects', '92', '92750c5f93c312ba9ab413d546f32190c56d6f1f'),
                '991b421dfd401f115241601b2b373140a8d78572': join('objects', '99', '991b421dfd401f115241601b2b373140a8d78572')
            } as { [hash: string]: string }

            Object.keys(objects).forEach(path => {
                const { hash } = objects[path]
                expect((new asset.Asset(path, hash)).getPath()).toBe(paths[hash])
            })
        })

        it('should returns legacy path to asset', () => {
            const paths = {
                'bdf48ef6b5d0d23bbb02e17d04865216179f510a': join('legacy', 'icons', 'icon_16x16.png'),
                '92750c5f93c312ba9ab413d546f32190c56d6f1f': join('legacy', 'icons', 'icon_32x32.png'),
                '991b421dfd401f115241601b2b373140a8d78572': join('legacy', 'icons', 'minecraft.icns')
            } as { [hash: string]: string }

            Object.keys(objects).forEach(path => {
                const { hash } = objects[path]
                expect((new asset.Asset(path, hash)).getPath(true)).toBe(paths[hash])
            })
        })

    })

    describe('#toArtifact', () => {

        it('should returns new artifact instance', () => {
            Object.keys(objects).forEach(path => {
                const { hash } = objects[path]
                expect((new asset.Asset(path, hash)).toArtifact()).toBeTruthy()
            })
        })

    })

})
