const { writeFile, readFile, stat, unlink, appendFile, open, readdir } = require('fs/promises');

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

  // try {
  //   const fHandler = await open('./message.tt')
  //   const buffer = Buffer.alloc(2)
  //   const filePart = await fHandler.read(buffer, 0, 2, 0)
  //   for (let i = 0; i < buffer.length; i++) {
  //     console.info(String.fromCharCode(buffer[i]))
  //   }
  // } catch (err) {
  //   console.error(err)
  //   console.info('file not exits')
  // }

  try {
    const fHandler = await open('./www')
    const fstat = await fHandler.stat()
    if (fstat.isDirectory()) {
      const files = await readdir('./www')
      for (const file of files) {
        const fHandler = await open('./www/' + file)
        const fstat = await fHandler.stat()
        console.info('filename=' + file + 'size=' + fstat.size)
        await fHandler.close()
      }
      await fHandler.close()
    }
  } catch (err) {
    console.error(err)
    console.info('file not exits')
  }
  
})()



