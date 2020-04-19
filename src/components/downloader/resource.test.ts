
// {
//     "path": "com/mojang/patchy/1.1/patchy-1.1.jar",
//     "sha1": "aef610b34a1be37fa851825f12372b78424d8903",
//     "size": 15817,
//     "url": "https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar"
// }

import { Resource } from './resource'
import { join } from 'path'

const resource = new Resource(
    'https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar',
    join(__dirname, 'com/mojang/patchy/1.1/patchy-1.1.jar'),
    'aef610b34a1be37fa851825f12372b78424d8903'
)

it('should download a resource', async done => {
    expect(await resource.downloadAsync(true)).toBe(true)
    done()
})

it('should calculate hash of resource', done => {
    expect(resource.calculateHash('sha1')).toBe(resource.sha1)
    done()
})
