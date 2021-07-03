const { writeFile, readFile, stat, unlink, appendFile, open, readdir } = require('fs/promises');
const fs = require('fs');


function readFilePart(fd, buffer, offset, length, position) {
  return new Promise((resolve, reject) => {
    fs.read(fd, buffer, offset, length, position, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

function getFd(path) {
  return new Promise((resolve, reject) => {
    fs.open(path, 'wx', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

(async () => {
  // try {
  //   const data = new Uint8Array(Buffer.from('Hello Node.js and'));
  //   const promise = writeFile('./message.txt', data);
  

  
  //   await promise;
  //   console.info(promise)
  // } catch (err) {
  //   // When a request is aborted - err is an AbortError
  //   console.error(err);
  // }

  // try {
  //   const txt = await readFile('./message.txt')
  // } catch (err) {
  //   console.info('file not exits')
  // }

  // try {
  //   const txt = await stat('./message.txt')
  //   console.info(txt.isFile())
  // } catch (err) {
  //   console.info('file not exits')
  // }

  // try {
  //   const txt = await unlink('./message.txt')
  //   console.info(txt)
  // } catch (err) {
  //   console.info('file not exits')
  // }
 
  // try {
  //   const data = new Uint8Array(Buffer.from('update come from append'));
  //   const promise = appendFile('./message.txt', data);
  

  
  //   await promise;
  //   console.info(promise)
  // } catch (err) {
  //   // When a request is aborted - err is an AbortError
  //   console.error(err);
  // }

  try {
    const fHandler = await open('./message.txt')
    const buffer = Buffer.alloc(2)
    const filePart = await fHandler.read(buffer, 0, 2, 0)
    for (let i = 0; i < buffer.length; i++) {
      console.info(String.fromCharCode(buffer[i]))
    }
  } catch (err) {
    console.error(err)
    console.info('file not exits')
  }

  
})()



