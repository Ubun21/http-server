const fs = require('fs')
const path = require('path')
const { open } = require('fs/promises')

module.exports = async function getPlugin(env, mess) {
  if (mess.response.status) {
    return mess
  }

  if (mess.request.path.indexOf('.') === 0) {
    mess.response.status = 403
    return mess
  }

  if (mess.request.method !== 'PUT') {
    return mess
  }


  const requestPath = path.resolve(env.root + mess.request.path)

  let fileHandle
  let fsStat
  try {
    fileHandle = await open(requestPath)
    fsStat = await fileHandle.stat()
  } catch (e) {
    if (e.errno === -2) {
      mess.response.status = 404
      return mess
    }
  }

  if (fsStat.isFile()) {
    try {
      // 写入成功返回undifine
      const result = await fileHandle.write(mess.request.body)
      if (!result) {
        mess.response.status = 200
      }
    } catch (error) {
      mess.response.status = 500
      console.error(error)
    } finally {
      await fileHandle.close()
    }
    
    return mess
  }

  mess.response.status = 404
  return mess
}