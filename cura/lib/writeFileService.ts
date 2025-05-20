import * as fs from 'fs'
import { resolve, join } from 'path'

export default class WriteFileService {
    createTempFolder(fileId: string): string{
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
    startFileWriting(fileId: string) {
        const tempFolder = this.createTempFolder(fileId)

    }

    async writeFilePart(fileId: string, filePart: File) {
        const tempPath = this.createTempFolder(fileId)
        const filePath = join(tempPath, 'hash')
        fs.writeFileSync(filePath, await filePart.bytes())
    }
    assebmleFile(fileId: string){

    }
}