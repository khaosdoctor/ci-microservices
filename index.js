const axios = require('axios')
const http = require('http')
require('dotenv').config({silent: true})

async function getAccessToken () {
  try {
    const { API_USER_ID, API_USER_SECRET } = process.env
    const options = { auth: { username: API_USER_ID, password: API_USER_SECRET } }
    const { data } = await axios.get('https://api.globalcode.com.br/v1/oauth2/token', options)
    return data['Access-Token']
  } catch (error) {
    throw error
  }
}

async function getTalk (accessToken, talkId) {
  try {
    const url = `https://api.globalcode.com.br/v1/publico/evento/104/modalidade/2335/palestra/${talkId}`
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const {data} = await axios.get(url, options)
    return data
  } catch (error) {
    throw error
  }
}

async function getPresenter (accessToken, talkId) {
  try {
    const url = `https://api.globalcode.com.br/v1/publico/evento/104/modalidade/2335/palestra/${talkId}/palestrantes`
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const {data} = await axios.get(url, options)
    return data
  } catch (error) {
    throw error
  }
}

async function serverHandler (request, response) {
  if (['/favicon.ico'].includes(request.url)) return response.end()

  try {
    const accessToken = await getAccessToken()
    const talk = await getTalk(accessToken, 8704)
    const presenter = await getPresenter(accessToken, 8704)
    talk.palestrantes = presenter
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.write(JSON.stringify(talk))
  } catch (e) {
    response.statusCode = 500
    response.write(e.message)
  } finally {
    response.end()
  }
}

const server = http.createServer(serverHandler)

server.listen(process.env.PORT, () => console.log(`TDC Server is listening on ${process.env.PORT}`))
