
import { Resource } from '../index'
import { join } from 'path'

const path = join('launcher', 'patchy.jar')
const url = 'https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar'
const sha1 = 'aef610b34a1be37fa851825f12372b78424d8903'

const resource = new Resource(path, url, sha1)

resource.on('debug', (e) => console.log(e))
resource.on('error', (e, error) => {
    console.error(e, error)
})

resource.on('download-status', ({
    currentBytes,
    totalBytes,
}) => {
    const percent = Math.round(currentBytes / totalBytes * 100)
    console.log(currentBytes, totalBytes, `${percent}%`)
})

resource.isSuccess().then(success => {
    return success ? success : resource.download()
}).then(success => {
    console.log(success)
}).catch(error => {
    console.error(error)
})
