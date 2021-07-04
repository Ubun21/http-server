const HttpParser = require('./parser')
const makeResponse = require('./makeResponse')
const postPlugin = require('./postPlugin')
const getPlugin = require('./getPlugin')
const path = require('path')
const putPlugin = require('./putPlugin')
const deletePlug = require('./deletePlug')
const authPluin = require('./authPlugin')
const corsPlugin = require('./cors')
const optionsPlugin = require('./optionsPlugin')
const checkPlugin = require('./checkPlugin')



module.exports = (connection) => {

  const parser = new HttpParser
  const env = {
    root: path.resolve('./www'),
    session: path.resolve('./www/session')
  }
  
  connection.on('data', (data) => {
    parser.append(data)
  })

  parser.on('fished', async (mess) => {
    console.info('called')
    debugger
    mess = corsPlugin(mess)
    mess = await postPlugin(env, mess)
    mess = await checkPlugin(env, mess)
    mess = await optionsPlugin(env, mess)
    mess = await authPluin(env, mess)
    mess = await getPlugin(env, mess)
    mess = await putPlugin(env, mess)
    mess = await deletePlug(env, mess)
    let response = makeResponse(mess)
    connection.end(response)
  })
}