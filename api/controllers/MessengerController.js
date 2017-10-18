'use-strict'
import Paths from '../conf/Paths'
import fetch from 'node-fetch'
import Boom from 'boom'
import request from 'request'

exports.webhookSubsciption = (request, reply) => {
    if (request.query['hub.mode'] === 'subscribe' && request.query['hub.verify_token'] === process.env.SECRET) {
        reply(request.query['hub.challenge'])
    } else {
        reply(Boom.unauthorized())
    }
}

exports.webhookReceiveMessage = (request, reply) => {
    if (request.payload.object === 'page') {
        request.payload.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message) {
                    getUser(event.sender.id)
                    .then(json => {
                        if(json.id){
                            const message = {
                                content: event.message.text,
                                iduser: json.id,
                                idmessenger: json.idmessenger,
                                creationdate: Date.now()
                            }
                            postNewMessage(message)
                        }
                    })
                }
            })
        })
        reply()
    } else {
        reply(Boom.notFound())
    }
}

exports.replyMessage = (request, reply) => {
    sendMessage(request.payload)
}

const getUser = (id) => {
    return fetch(Paths.extern.userService.getUser(id))
    .then(res => res.json())
    .catch((err) => console.log(err))
}

const postNewMessage = (message) => {
    return fetch(Paths.extern.messageService.messagePost(), {
        method: 'POST',
        body: JSON.stringify(message) })
    .catch(err => console.log(err))
}

/*const replyOnMessenger = (message) => {
    return fetch('https://graph.facebook.com/v2.10/me/messages', {
        method: 'POST',
        headers: { 'access_token': `${process.env.MESSENGER_TOKEN}` },
        body: {
            recipient: {id: message.iduser},
            message: {
                attachment: {
                    type: message.type,
                    payload: { url: message.content }
                }
            }
        }
    })
    .then(res => reply(res))
    .catch(err => console.log(err))
}*/

const sendMessage = (message) => {
    request({
        url: Paths.extern.facebook.messages(),
        qs: {access_token: process.env.MESSENGER_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: message.iduser},
            message: {
                attachment: {
                    type: message.type,
                    payload: {
                        url: message.content
                    }
                }
            }
        }
    }, (err, res) => {
        if (err) {
            console.log('Error sending message: ', err)
        } else if (res.body.error) {
            console.log('Error: ', res.body.error)
        }
    })
}
