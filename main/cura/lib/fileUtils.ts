import * as fs from 'fs'
import { resolve, join } from 'path'
import HashingService from './hashingService'
import { Queue } from 'bullmq'

export function resolveTempFolder(fileId: string): string{
    const path = resolve(useRuntimeConfig().filesFolderPath)
    if(!fs.existsSync(path)){
        fs.mkdirSync(path)
    }
    const partsPath = join(path, 'parts')
    if(!fs.existsSync(partsPath)){
        fs.mkdirSync(partsPath)
    }
    const tempPath = join(partsPath, fileId)

    if(!fs.existsSync(tempPath)){
        fs.mkdirSync(tempPath)
    }

    return tempPath 
}
export async function writeFileChunk(fileId: string, chunk: File, chunckNumber: number) {
    const tempPath = resolveTempFolder(fileId)
    const hasher = new HashingService()
    const hash = hasher.hashSlice(await chunk.arrayBuffer())
    const filePath = join(tempPath, `${chunckNumber}_${hash}`)
    fs.writeFileSync(filePath, await chunk.bytes())

}