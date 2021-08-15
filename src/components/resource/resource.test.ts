
import { Resource } from './resource'
import * as path from 'path'
import * as nock from 'nock'
import { URL } from 'url'

describe('Downloader', () => {

    const _sha1 = '8654270374147e54fe40b44f95932945f3e2db9f'
    const _url = new URL('http://localhost:25560/files/testing.json')
    const _path = path.join(__dirname, _url.pathname)

    describe('#download', () => {

        const _response = { property_string: 'string', property_number: 2 }

        it('should download a resource (200 OK)', async () => {
            nock(_url.origin).get(_url.pathname).reply(200, _response)

            const resource = new Resource(_path, _url.href, _sha1)
            resource.on('debug', e => { /* console.log(e) */ })
            resource.on('error', e => { /* console.log(e) */ })

            expect(await resource.download(false)).toBe(true)
        })

        it('should return `false` when response code != 200', async () => {
            nock(_url.origin).get(_url.pathname).reply(400, _response)

            const resource = new Resource(_path, _url.href, _sha1)
            resource.on('debug', e => { /* console.log(e) */ })
            resource.on('error', e => { /* console.log(e) */ })

            expect(await resource.download(true)).toBe(false)
        })

        it('should return `false` when checking an invalid hash, if `checkAfter` = `true`', async () => {
            nock(_url.origin).get(_url.pathname).reply(200, _response)

            const resource = new Resource(_path, _url.href, 'abc')
            resource.on('debug', e => { /* console.log(e) */ })
            resource.on('error', e => { /* console.log(e) */ })

            expect(await resource.download(true)).toBe(false)
        })

        it('should return `true` when checking an invalid hash, if `checkAfter` = `false`', async () => {
            nock(_url.origin).get(_url.pathname).reply(200, _response)

            const resource = new Resource(_path, _url.href, 'abc')
            resource.on('debug', e => { /* console.log(e) */ })
            resource.on('error', e => { /* console.log(e) */ })

            expect(await resource.download(true)).toBe(false)
        })

        it('should emitted resource downloading progress', async () => {
            const length = 48

            nock(_url.origin).get(_url.pathname).reply(200, _response, {
                'content-length': length.toString()
            })

            const resource = new Resource(_path, _url.href, _sha1)
            // resource.on('debug', (e) => { console.log(e) })
            // resource.on('error', (e, err) => { console.error(e, err) })
            resource.on('download-status', ({
                currentBytes,
                totalBytes,
            }) => {
                const percent = Math.round(currentBytes / totalBytes * 100)
                if (percent >= 100) expect(currentBytes).toBe(length)
            })

            await resource.download()
        })

    })

    describe('#calculateHash', () => {

        it('should calculate hash of resource', async () => {
            const sha1 = await Resource.calculateHash({ path: _path }, 'sha1')
            expect((sha1)).toBe(_sha1)
        })

    })

})
