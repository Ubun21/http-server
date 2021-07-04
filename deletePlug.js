const fs = require('fs')
const path = require('path')
const { open, unlink } = require('fs/promises')

module.exports = async function getPlugin(env, mess) {
  if (mess.response.status) {
    return mess
  }

  if (mess.request.path.indexOf('.') === 0) {
    mess.response.status = 403
    return mess
  }

  if (mess.request.method !== 'DELETE') {
    return mess
  }


  const requestPath = path.resolve(env.root + mess.request.path)

  let fileHandle
  let fileStat
  let isFile
  try {
    fileHandle = await open(requestPath)
    fileStat = await fileHandle.stat()
    isFile = fileStat.isFile()
  } catch (error) {
    if (error.errno === -2) {
      mess.response.status = 404
      return mess
    }
  } finally {
    await fileHandle.close()
  }

  const fsState = fs.statSync(requestPath)

  if (fsState.isFile()) {
    mess.response.status = 200
    fs.unlinkSync(requestPath)
    
    return mess
  }

  if (isFile) {
    try {
      const result = await unlink(requestPath)
      if (!result) {
        mess.response.status = 200
        return mess
      }
    } catch (error) {
      console.error(error)
    }
  }

  mess.response.status = 404
  return mess

}