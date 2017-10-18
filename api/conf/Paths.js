'use strict'
require('dotenv').config()

const path = process.env.BASIC_PATH

module.exports = {
    extern: {
        userService: {
            getUser: id => `http://192.168.100.1:4324/api/user/${id}`
        },
        messageService: {
            messagePost: () => 'http://192.168.100.1:4323/api/message'
        },
        facebook: {
            messages: () => 'https://graph.facebook.com/v2.10/me/messages'
        }
    },
    intern: {
        webhook: '/webhook',
        reply: `${path}reply`
    }
}
