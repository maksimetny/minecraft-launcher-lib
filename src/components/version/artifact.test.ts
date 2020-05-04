
import { Artifact } from './artifact'
import { sep } from 'path'

describe('Artifact', () => {

    describe('#toResource', () => {

        it('should convert an instance of an artifact to a resource', () => {
            const artifact = new Artifact('https://example.com/launcher.jar', 'launcher.jar', '03803d8fddcaf20844048a4858b2dbb0e47ce033')
            const resource = artifact.toResource('launcher')

            expect((resource).path).toBe(`launcher${sep}`.concat(artifact.path))
            expect((resource).url).toBe(artifact.url)
            expect((resource).sha1).toBe(artifact.sha1)
        })

    })

    describe('#isDownloadable', () => {

        it('should check if artifact is downloadable', () => {
            const _1 = Artifact.isDownloadable({ url: 'https://example.com/launcher.jar' })
            const _2 = Artifact.isDownloadable({ path: 'launcher.jar', url: 'https://example.com/launcher.jar', sha1: '03803d8fddcaf20844048a4858b2dbb0e47ce033' })
            const _3 = Artifact.isDownloadable({ path: 'launcher.jar', url: 'https://example.com/launcher.jar' })

            expect((_1)).toBeFalsy()
            expect((_2)).toBeTruthy()
            expect((_3)).toBeFalsy()
        })

    })

})
