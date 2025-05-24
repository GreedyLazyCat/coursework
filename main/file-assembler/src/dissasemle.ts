import * as fs from 'fs'
import { join, resolve } from 'path'

function dissasemble(){
    const filepath = resolve('./test-file.jpg')
    const dir = resolve(`./`)
    const file = fs.readFileSync(filepath)
    const middle = Math.floor(file.length / 2)
    const fileStream = fs.createReadStream(filepath, {highWaterMark: middle})
    let index = 0 
    fileStream.on("data", (chunk)=>{
        fs.writeFileSync(join(dir, `${index}`), chunk)
        index += 1
    })
}

dissasemble()