'use strict'

import routes from './api/routes/Routes'
import Hapi from 'hapi'
require('dotenv').config()
import Boom from 'boom'
import swaggered from 'hapi-swaggered'
import swaggeredUI from 'hapi-swaggered-ui'
import vision from 'vision'
import inert from 'inert'

if (!process.env.SECRET || !process.env.MESSENGER_TOKEN) {
  throw 'Make sure you define a SECRET and a MESSENGER_TOKEN in your .env file'
}

const server = new Hapi.Server()
server.connection({ port: 4321, host: 'localhost', routes: { cors: true }, labels: ['api'] })

server.register([
    vision,
    inert,
    {
        register: swaggered,
        options: {
            info: {
                title: 'Messenger Service API',
                description: 'API documentation for Messenger Service',
                version: '1.0'
            }
        }
    },
    {
        register: swaggeredUI,
        options: {
            title: 'Gif Bot Messenger-Service API',
            path: '/docs',
            swaggerOptions: {}
        }
    }
], {
    select: 'api'
}, (err) => { if (err) { throw err } })

routes(server)

server.start((err) => {
    if (err) {
        throw err
    }
    console.log(`Server running at: ${server.info.uri}`)
})
