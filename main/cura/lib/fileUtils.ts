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
export async function writeFileChunk(fileId: string, chunk: Blob, hash: string, chunckNumber: number) {
    const tempPath = resolveTempFolder(fileId)
    const filePath = join(tempPath, `${chunckNumber}_${hash}`)
    fs.writeFileSync(filePath, await chunk.bytes())
}

export function removeFile(fileName: string){
    const dirPath = resolve(useRuntimeConfig().filesFolderPath)
    const filePath = join(dirPath, fileName)
    fs.rmSync(filePath)
}