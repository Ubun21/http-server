const fs = require('fs')
const { open, mkdir, writeFile } = require('fs/promises')
const path = require('path')

module.exports = async function postPlugin (env, mess) {
  if (mess.response.status) {
    return mess
  }

  if (mess.request.path.indexOf('.') === 0) {
    mess.response.status = 403
    return mess
  }

  if (mess.request.method !== 'POST') {
    return mess
  }

  const requestPath = env.root + mess.request.path

  try {
    const fileHandle = await open(requestPath)
    if (fileHandle.fd) {
      mess.response.status = 403
      return mess
    }
  } catch (error) {
    // no such file or director
    if (error.errno === -2) {
      const result = await mkdir(path.dirname(requestPath), { recursive: true})
      if (!result) {
       const sucess = await writeFile(requestPath, mess.request.body)
       mess.response.status = 201
       return mess
      }
    }
  }
}