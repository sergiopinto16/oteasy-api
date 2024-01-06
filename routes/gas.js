const express = require('express')
const Gas = require('../models/gasReport')
const {
    addGasReport,
    gasReports,
} = require('../controllers/gasController')

const router = express.Router()



// add gas report
router.post('/add',addGasReport)


// profile User
router.get('/gasReports',gasReports)


module.exports = router

