
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
            const libs: Library[] = Library.resolve(libraries).filter(lib => {
                return lib.isApplicable(platform, features)
            })

            return iterator([
                ...libs.map(lib => lib.downloads.artifact.toResource(directory)),
                ...libs.filter(lib => {
                    return lib.hasNatives(platform.name)
                }).map(lib => {
                    const { [lib.getNativeClassifier(platform)]: artifact } = lib.downloads.classifiers
                    return artifact.toResource(directory)
                })
            ])
        }
    }

}
