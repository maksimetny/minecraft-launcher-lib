
import { Artifact, IArtifact } from '../artifact'
import { join } from 'path'

import {
    Asset,
    IAsset,
    IAssetIndex,
} from './asset'

describe('Asset', () => {

    const index: IAssetIndex = {
        objects: {
            'icons/icon_16x16.png': {
                hash: 'bdf48ef6b5d0d23bbb02e17d04865216179f510a',
                size: 3665,
            },
            'icons/icon_32x32.png': {
                hash: '92750c5f93c312ba9ab413d546f32190c56d6f1f',
                size: 5362,
            },
            'icons/minecraft.icns': {
                hash: '991b421dfd401f115241601b2b373140a8d78572',
                size: 114786,
            },
        },
    }

    describe('#subhash', () => {

        const subhashes: Record<string, string> = {
            'bdf48ef6b5d0d23bbb02e17d04865216179f510a': 'bd',
            '92750c5f93c312ba9ab413d546f32190c56d6f1f': '92',
            '991b421dfd401f115241601b2b373140a8d78572': '99',
        }

        it('should returns subhash', () => {
            Object.keys(index.objects).forEach(path => {
                const {
                    hash,
                    size,
                } = index.objects[path]
                const {
                    subhash,
                } = new Asset(path, hash, size)

                expect(subhash).toBe(subhashes[hash])
            })
        })

    })

    describe('#toArtifact', () => {

        it('should returns new artifact instance', () => {
            Object.keys(index.objects).forEach(path => {
                const {
                    hash,
                    size,
                } = index.objects[path]
                const artifact = new Asset(path, hash, size).toArtifact()
                expect((artifact instanceof Artifact)).toBeTruthy()
            })
        })

    })

})
