const fs = require('fs')
const Event = require('events')

class HttpParser extends Event {

  _state = this._read_request_line
  _message = {
    request: {
      method: '',
      path: '',
      version: '',
      headers: [],
      body: Buffer.from('')
    },
    response: {
      status: 0,
      headers: [],
      body: Buffer.from('')
    }
  }
  _cache = null

  append(conn) {
    for (let i = 0; i < conn.length; i++) {
      this._state = this._state(conn[i])
    }
  }

  _read_request_line (conn) {
    if (!this._cache) {
      // pointer method path version crFlash
      this._cache = [1, '', '', '', false]
    }
    if (conn === 0x20) { // 0x20 sp
      this._cache[0]++
    } else if (conn === 0x0D) { // 0x0D cl
      this._cache[4] = true
    } else if (this._cache[4] && conn === 0x0A) { // 0x0A lf
      this._message.request.method = this._cache[1]
      this._message.request.path = this._cache[2]
      this._message.request.version = this._cache[3]

      this._cache = null
      return this._read_head
    } else {
      this._cache[this._cache[0]] += String.fromCharCode(conn)    
    }

    return this._read_request_line
  }

  _read_head (conn) {
    // debugger
    if (!this._cache) {
      this._cache = [1, '', '', false]
    }
    if (conn === 0x3A) { // 0x3A === :
      this._cache[0] ++
    } else if (conn === 0x0D) {
      this._cache[3] =true
    } else if (this._cache[3] && conn === 0x0A) {
      
      if (this._cache[1]) {
        this._message.request.headers.push({
          headName: this._cache[1],
          headVal: this._cache[2]
        })
        this._cache = null
      } else {
        const contentLenght = this._message.request.headers.filter((item) => {
          return item.headName === 'Content-Length'
        })

        if (contentLenght && contentLenght[0] && parseInt(conn) > 0) {
          this._cache = null
          return this._read_body
        }

        this._cache = null
        return this._send_end_event(conn)
      }
    } else {
      this._cache[this._cache[0]] += String.fromCharCode(conn)
    }
    return this._read_head
  }
  _read_body (conn) {
    const contentLenght = this._message.request.headers.filter((itme) => {
      return itme.headName === 'Content-Length'
    })[0].headVal

    if (!this._cache) {
      this._cache = [
        parseInt(contentLenght),
        0,
        new Uint8Array(parseInt(contentLenght))
      ]
    }

    if (this._cache[1] < this._cache[0]) {
      this._cache[2][this._cache[1]] = conn
      this._cache[1]++

      if (this._cache[1] === this._cache[0]) {
        this._message.request.body = Buffer.from(this._cache[2])
        this._cache = null
        return this._send_end_event(conn)
      }
    }

    return this._read_body
  }

  _send_end_event(conn) {
    this.emit('fished', this._message)
    return this._end(conn)
  }

  _end(conn) {
    return this._end
  }
}

module.exports = HttpParser