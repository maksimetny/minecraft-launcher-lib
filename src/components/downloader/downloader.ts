
import { events, urls } from '../../constants'
import { existsSync } from 'fs'
import { Resource } from './resource'
import { Library, ILibrary, Features } from '../version'
import { Platform, IPlatform } from '../util'

export class Downloader {

    static iteratorFactory(download = async (resource: Resource) => {
        resource.on(events.DEBUG, e => console.log(e))
        resource.on(events.ERROR, e => console.log(e))
        return existsSync(resource.path) ? true : resource.downloadAsync()
    }) {
        return async (resources: Resource[]) => {
            const downloadPromises = resources.map(download)
            const results = await Promise.all(downloadPromises)
            return !(results).includes(false)
        }
    }

    static downloadLibs(iterator = Downloader.iteratorFactory(/* iterator */)) {
        return (libraries: Partial<ILibrary>[], directory: string, platform: Partial<IPlatform> = { /* platform */ }, features: Features = { /* features */ }) => {
            return iterator([
                ...Library.resolve(libraries).filter(lib => lib.isApplicable(platform, features)).map(lib => {
                    return lib.downloads.artifact.toResource(directory)
                }),
                ...Library.resolve(libraries).filter(lib => lib.hasNatives(platform.name)).filter(lib => {
                    return lib.isApplicable(platform, features)
                }).map(lib => {
                    const { [lib.getNativeClassifier(platform)]: artifact } = lib.downloads.classifiers
                    return artifact.toResource(directory)
                })
            ])
        }
    }

}
