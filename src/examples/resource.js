
import { Resource } from '../index'
import * as path from 'path'

const resource = new Resource('https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar', path.resolve('launcher/patchy.jar'), 'aef610b34a1be37fa851825f12372b78424d8903')

resource.on('debug', (e) => console.log(e))
resource.on('error', (e, err) => {
    console.error(e, err)
})

resource.on('download-status', status => {
    const x = Math.round(status.current / status.total.received * 100)
    console.log(x, status)
})

if (resource.isSuccess) {
    console.log(resource.path)
} else {
    resource.downloadAsync().then(success => {
        console.log(success)
    }, err => console.error(err))
}
