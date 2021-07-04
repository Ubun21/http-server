const { getHeader, setHeader } = require('./utils')
const path = require('path')
const { writeFile, readFile } = require('fs/promises')

module.exports = async function auth(env, mess) {
  if (mess.response.status) {
    return mess
  }

  const authData = getHeader(mess.request.headers, 'Authorization')

  if (authData) {
    const match = authData.match(/basic\s*(\w+)/i)
    if (match) {
      const usrAndPw = Buffer.from(match[1], 'base64').toString().split(':')
      const user = usrAndPw[0]
      const pass = usrAndPw[1]
      if (user === 'admin' && pass === '123456') {
        let sessionID = 'session' + new Date().getTime()
        let sessionPath = path.resolve(env.session, sessionID)
        try {
          const result = await writeFile(sessionPath, user)
        } catch (error) {
          console.info(error)
        }
        setHeader(mess.response.headers, 'Set-Cookie', 'sessionid=' + sessionID + ';max-age=3600')
        return mess
      } else {
        mess.response.status = 401
        setHeader(mess.response.headers, 'WWW-Authenticate', 'Basic realm="login"')
        return mess
      }
    }

  }

  debugger
  const cookieData = getHeader(mess.request.headers, 'Cookie')
  if (cookieData) {
    debugger
    const match = cookieData.match(/sessionid=(session\d+)/)
    if (match && match[1]) {
      const sessionPath = path.resolve(env.session, match[1]) 
      let data = ''
      try {
        data = await readFile(sessionPath)
      } catch (error) {
        console.info(error)
      }
      if (data === 'admin') {
        return mess
      }
    } 
  }

  mess.response.status = 401
  setHeader(mess.response.headers, 'WWW-Authenticate', 'Basic realm="login"')
  return mess
}