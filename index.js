'use strict';

import routes from './api/routes/Routes'
import Hapi from 'hapi'
require('dotenv').config();
import Boom from 'boom'

if (!process.env.SECRET || !process.env.MESSENGER_TOKEN) {
  throw 'Make sure you define a SECRET and a MESSENGER_TOKEN in your .env file';
}

const server = new Hapi.Server();
server.connection({ port: 4321, host: 'localhost', routes: { cors: true } });

routes(server)

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
