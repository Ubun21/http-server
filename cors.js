const { setHeader } = require('./utils')

module.exports = function cors(mess) {
  if (mess.response.status) {
    return mess
  }

  if (mess.request.path.indexOf('.') === 0) {
    mess.response.status = 403
    return mess
  }

  setHeader(mess.response.headers, 'Access-Control-Allow-Origin', 'http://a.com:9000')
  setHeader(mess.response.headers, 'Access-Control-Allow-Credentials', 'true')
  return mess
}