
import { events, urls } from '../../constants'
import { Resource } from './resource'

export class Downloader {

    private static downloadFactory(iterator = (resource: Resource) => {
        resource.on(events.DEBUG, e => console.log(e))
        resource.on(events.ERROR, e => console.log(e))
        return resource.downloadAsync()
    }) {
        return async (resources: Resource[]) => {
            const downloadPromises = resources.map(iterator)
            const results = await Promise.all(downloadPromises)
            return !(results).includes(false)
        }
    }

    static download(resources: Resource[]) {
        return Downloader.downloadFactory()(resources)
    }

}
