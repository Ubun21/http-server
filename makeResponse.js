const statusMap = {
  200: 'OK',
  206: 'Part Request',
  201: 'Created',
  304: 'Not Modified',
  401: 'Require Auth',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
}

module.exports = (message) => {
  if (!message.response.status) {
    message.response.status = 500
  }

  const responMess = statusMap[message.response.status]

  const statuLine = `${message.request.version} ${message.response.status} ${responMess}\r\n`

  message.response.headers.push({
    headName: 'Content-Length',
    headVal: message.response.body.length
  })

  let headers = message.response.headers.map((item) => {
    return `${item.headName}: ${item.headVal}`
  }).join('\r\n')

  headers = headers + '\r\n\r\n'

  return Buffer.concat([
    Buffer.from(statuLine, 'ascii'),
    Buffer.from(headers, 'ascii'),
    message.response.body
  ])
}