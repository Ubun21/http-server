const fs = require('fs')
const path = require('path')

module.exports = function postPlugin (env, mess) {
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
  if (fs.existsSync(requestPath)) {
    mess.response.status = 403
    return mess
  }

  fs.mkdirSync(path.dirname(requestPath), { recursive: true})
  fs.writeFileSync(requestPath, mess.request.body)
  mess.response.status = 201
  return mess
}