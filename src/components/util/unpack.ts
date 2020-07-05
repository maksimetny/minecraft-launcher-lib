
import * as adm from 'adm-zip'
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'
import { createHash } from 'crypto'

export const unpack = (path: string, unpackTo: string, exclude: string[] = []) => {
    const zip = new adm(path)

    const getHash = (data: Buffer) => createHash('sha1').update(data).digest('hex')

    zip.getEntries()
        .filter(entry => {
            return !entry.isDirectory
        })
        .filter(entry => {
            return !exclude.map(item => entry.entryName.startsWith(item) ? false : true).includes(false)
        })
        .filter(entry => {
            const localPath = join(unpackTo, entry.entryName)

            if (existsSync(localPath)) {
                const entryData: Buffer = entry.getData()
                const entryHash = getHash(entryData)
                const localData = readFileSync(localPath)
                const localHash = getHash(localData)

                return (localHash !== entryHash) ? true : false
            } else {
                return true
            }
        })
        .forEach(entry => {
            try {
                // Если локального файла не существует или он поврежден,
                // распаковываем новый из архива.

                // console.log(`unpacking ${entry.name} from ${path} to ${unpackTo}..`)
                zip.extractEntryTo(entry, unpackTo)
            } catch (err) {
                // Only doing a console.warn since a stupid error happens.
                // You can basically ignore this.

                // console.warn(err)
            }
        })
}
