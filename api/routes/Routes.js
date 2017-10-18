'use strict'
import MessengerService from '../controllers/MessengerController.js'
import Paths from '../conf/Paths'
import Joi from 'joi'

module.exports = (server) => {

    server.route({
        method: 'GET',
        path: Paths.intern.webhook,
        handler: MessengerService.webhookSubsciption
    })

    server.route({
        method: 'POST',
        path: Paths.intern.webhook,
        handler: MessengerService.webhookReceiveMessage
    })

    server.route({
        method: 'POST',
        path: Paths.intern.reply,
        handler: MessengerService.replyMessage,
        config: {
            validate: {
                payload: {
                    content: Joi.string().min(0).required(),
                    type: Joi.string().valid('image', 'text').default('image'),
                    iduser: Joi.number().integer().min(0).required()
                }
            }
        }
    })
}
