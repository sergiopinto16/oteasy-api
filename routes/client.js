const express = require('express')
const Client = require('../models/clientModel')
const {
    registerClient,
    clients, client_id,
} = require('../controllers/clientController')


const router = express.Router()


// register client
router.post('/register', registerClient)

// profile Client
router.get('/clients', clients)

router.get('/client/:id', client_id)


module.exports = router

