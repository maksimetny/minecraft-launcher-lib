
// import { fetchVersions, fetchVersionMeta, IManifest, IManifestItem } from './meta'
// import * as nock from 'nock'

// const manifest: IManifest = {
//     latest: {
//         release: '1.15.2',
//         snapshot: '20w17a'
//     },
//     versions: [
//         {
//             id: '20w14infinite',
//             type: 'snapshot',
//             url: 'https://launchermeta.mojang.com/v1/packages/951a16d06efe7d5134a1c5fe8cf4d584326e8c32/20w14infinite.json',
//             time: '2020-04-22T13:07:37+00:00',
//             releaseTime: '2020-04-01T12:47:08+00:00'
//         },
//         {
//             id: '1.14.4',
//             type: 'release',
//             url: 'https://launchermeta.mojang.com/v1/packages/74b5fb5fa9ec7b14abe60b468e40703cfbf8d10e/1.14.4.json',
//             time: '2019-09-04T14:37:30+00:00',
//             releaseTime: '2019-07-19T09:25:47+00:00'
//         }
//     ]
// }

// describe('#fetchVersions', () => {

//     it('should fetch versions', async () => {
//         nock('http://localhost:25560').get('/version_manifest.json').reply(200, manifest)

//         const versions = await fetchVersions('http://localhost:25560/version_manifest.json')
//         expect((versions).length).toBeTruthy()
//     })

// })

// describe('#fetchVersionMeta', () => {

//     it('should fetch version meta', async () => {
//         nock('http://localhost:25560').get('/version_manifest.json').reply(200, manifest)

//         const version = await fetchVersionMeta('1.14.4', 'http://localhost:25560/version_manifest.json')
//         expect((version).id).toBe('1.14.4')
//     })

// })
