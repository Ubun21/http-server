const fs = require('fs')
const path = require('path')
const { getHeader, setHeader } = require('./utils')
const { open, readFile, readdir } = require('fs/promises')

module.exports = async function getPlugin(env, mess) {
  if (mess.response.status) {
    return mess
  }

  debugger
  if (mess.request.path.indexOf('.') === 0) {
    mess.response.status = 403
    return mess
  }

  if (mess.request.method !== 'GET') {
    return mess
  }


  const requestPath = path.resolve(env.root + mess.request.path)

  let fileHandle 
  try {
    fileHandle = await open(requestPath)
  } catch (error) {
    // no such file or dir
    if (error === -2) {
      mess.response.status = 404
      return mess
    }
  }

  let fsState
  try {
    fsState = await fileHandle.stat()
  } catch (error) {
    
  }

  try {
    if (fsState.isFile()) {
      // requestHeader Range: bytes=start-end
      const range = getHeader(mess.request.headers, 'Range')
      if (range) {
        const match = range.match(/bytes=(\d+)-(\d+)/)
        const content = Buffer.alloc(match[2] - match[1] + 1)
  
        try {
         const result = await fileHandle.read(content, 0, content, parseInt(match[1]))
        } catch (error) {
          console.info(error)
        } finally {
          await fileHandle.close()
        }
       
        mess.response.status = 206
        mess.response.body = content
        return mess
      }
  
      mess.response.status = 200
      mess.response.body = await readFile(requestPath)
      
      return mess
    }
  } catch (error) {
    console.info(error)
  }

  if (fsState.isDirectory()) {
    let files
    try {
      files = await readdir(requestPath)
    } catch (error) {
      console.error(error)
    }
    let contentHTML = `<table><tr>`
    for (let file of files) {
      let fileHandle
      let fileStat
      try {
        fileHandle = await open(requestPath + '/' + file)
        fileStat = await fileHandle.stat()
      } catch (error) {
        console.error(error)
      }
      contentHTML += `<th><td>fileName=${file}</td><td>filesize=${fileStat.size}</td><td>createTime=${fileStat.ctime}</td></th>`
      try {
        await fileHandle.close()
      } catch (error) {
        console.info(error)
      }
    }
    contentHTML += contentHTML + '</tr></table>'
    let html = `<html><head><title>${requestPath}</title><h1></h1>${requestPath}</head></br><body>${contentHTML}</body></html>`

    mess.response.status = 200
    mess.response.body = Buffer.from(html)

    try {
      await fileHandle.close()
    } catch (error) {
      
    }
    return mess
  }
}