const express = require('express')
const SessionReport = require('../models/sessionReportModel')
const {
    addSessionReport,
    sessionReports,
} = require('../controllers/sessionReportController')


const router = express.Router()


// add session report
router.post('/add', addSessionReport)


// post sessions
// body with client id
router.post('/sessionReports', sessionReports)


module.exports = router

