
import { Resource } from '../index'
import { join } from 'path'

// const directory = join('launcher', 'patchy')
// const path = join(directory, 'patchy.jar')
// const url = 'https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar'
// const sha1 = 'aef610b34a1be37fa851825f12372b78424d8903'

const directory = join('launcher', 'lwjgl-openal-3.2.1-natives-linux')
const path = join(directory, 'lwjgl-openal-3.2.1-natives-linux.jar')
const url = 'https://libraries.minecraft.net/org/lwjgl/lwjgl-openal/3.2.1/lwjgl-openal-3.2.1-natives-linux.jar'
const sha1 = 'bcd4be67863dd908f696f628c3ca9f6eb9ae5152'

const resource = new Resource(path, url, sha1)

resource.on('debug', (e) => console.log(e))
resource.on('error', (e, error) => {
    console.error(e, error)
})

resource.on('download-status', ({
    bytes,
}) => {
    const percent = Math.round(bytes.current / bytes.total * 100)
    console.log(bytes.current, bytes.total, `${percent}%`)
})

resource.isSuccess()
    .then(success => {
        return success ? success : resource.download()
    })
    .then(success => {
        if (success) {
            resource.extractTo(join(directory, 'jar'))
        }
    })
    .catch(error => {
        console.error(error)
    })
