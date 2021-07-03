const fs = require('fs')
const path = require('path')
const { setHeader } = require('./utils')

module.exports = function optionsPlugin(env, message) {
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

  if (!fs.existsSync(requestPath)) {
    message.response.status = 404
    return message
  }

  const fsStat = fs.statSync(requestPath)
  if (fsStat.isFile()) {
    setHeader(message.response.headers, 'Access-Control-Allow-Methods', 'GET, PUT, DELETE')
    message.response.status = 200
    return message
  }

  setHeader(message.response.headers, 'Access-Control-Allow-Methods', 'GET, POST')
  message.response.status = 200
  return message
}