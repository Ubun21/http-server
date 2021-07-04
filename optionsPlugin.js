const fs = require('fs')
const path = require('path')
const { setHeader } = require('./utils')
const { open } = require('fs/promises')

module.exports = async function optionsPlugin(env, message) {
  if (message.response.status) {
    return message
  }

  if (message.request.path.indexOf('.') === 0) {
    message.response.status = 403
    return message
  }

  if (message.request.method !== 'OPTIONS') {
    return message
  }


  const requestPath = path.resolve(env.root + message.request.path)

  let fileHandle
  let fileStat
  try {
    fileHandle = await open(requestPath)
    fileStat = await fileHandle.stat()
  } catch (error) {
    if (error.errno === -2) {
      message.response.status = 404
    }
  }

  if (fsStat.isFile()) {
    setHeader(message.response.headers, 'Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    message.response.status = 200

    try {
      const result = await fileHandle.close()
    } catch (error) {
      console.error(error)
    }
    return message
  }

  setHeader(message.response.headers, 'Access-Control-Allow-Methods', 'GET, POST')
  message.response.status = 200

  try {
    const result = await fileHandle.close()
  } catch (error) {
    console.error(error)
  }
  return message
}