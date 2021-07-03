const { getHeader, setHeader } = require('./utils')
const fs = require('fs')
const path = require('path')

module.exports = function checkPlugin(env, message) {
  if (message.response.status) {
    return message
  }

  if (message.request.path.indexOf('.') === 0) {
    message.response.status = 403
    return message
  }

  const requestPath = path.resolve(env.root + message.request.path)

  if (!fs.existsSync(requestPath)) {
    message.response.status = 404
    return message
  }

  const fsStat = fs.statSync(requestPath)

  if (fsStat.isFile) {
    const endTag = getHeader(message.request.headers, 'If-None-Match')
    if (endTag && endTag.trim() === fsStat.mtimeMs.toString(16) + fsStat.size.toString(16)) {
      message.response.status = 304
      return message
    }
  }


  setHeader(message.response.headers, 'Cache-Control', 'max-age=3600')
  setHeader(message.response.headers, 'Last-Modified', fsStat.mtimeMs)
  setHeader(message.response.headers, 'ETag', fsStat.mtimeMs.toString(16) + fsStat.size.toString(16))
  return message
}