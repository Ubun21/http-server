const fs = require('fs')
const path = require('path')
const { getHeader, setHeader } = require('./utils')

module.exports = function getPlugin(env, mess) {
  if (mess.response.status) {
    return mess
  }

  debugger
  if (mess.request.path.indexOf('.') === 0) {
    mess.response.status = 403
    return mess
  }

  if (mess.request.method !== 'GET') {
    return mess
  }


  const requestPath = path.resolve(env.root + mess.request.path)

  if (!fs.existsSync(requestPath)) {
    mess.response.status = 404
    return mess
  }

  const fsState = fs.statSync(requestPath)

  if (fsState.isFile()) {
    // requestHeader Range: bytes=start-end
    const range = getHeader(mess.request.headers, 'Range')
    if (range) {
      debugger
      const match = range.match(/bytes=(\d+)-(\d+)/)
      const content = Buffer.alloc(match[2] - match[1] + 1)
      const fd = fs.openSync(requestPath)
      fs.readSync(fd, content, 0, content.length, parseInt(match[1]))
      fs.closeSync(fd)
      mess.response.status = 206
      mess.response.body = content
      return mess
    }

    if (requestPath.includes('.html')) {
      mess.response.status = 200
      // Content-Type: text/html; charset=UTF-8
      setHeader(mess.response.headers, "Content-Type", "text/html")
      mess.response.body = fs.readFileSync(requestPath)
    }

    mess.response.status = 200
    mess.response.body = fs.readFileSync(requestPath)
    
    return mess
  }

  if (fsState.isDirectory()) {
    const files = fs.readdirSync(requestPath)
    let contentHTML = `<table><tr>`
    let itemHTML = files.map((item) => {
      let itemName = item
      let itemStat = fs.readFileSync(path.resolve(requestPath + itemName))
      let itmeSize = itemStat.size
      return `<th>name:${itemName} </th><th>size:${itmeSize}</th>`
    }).join('')
    contentHTML += itemHTML + '</tr></table>'
    let html = `<html><head><title>${requestPath}</title><h1></h1>${requestPath}</head></br><body>${contentHTML}</body></html>`

    mess.response.status = 200
    mess.response.body = Buffer.from(html)

    return mess
  }
}