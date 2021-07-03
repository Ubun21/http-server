const fs = require('fs')
const path = require('path')

module.exports = function getPlugin(env, mess) {
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

  if (!fs.existsSync(requestPath)) {
    mess.response.status = 404
    return mess
  }

  const fsState = fs.statSync(requestPath)

  if (fsState.isFile()) {
    mess.response.status = 200
    fs.writeFileSync(requestPath, mess.request.body)
    
    return mess
  }

  mess.response.status = 404
  return mess

}