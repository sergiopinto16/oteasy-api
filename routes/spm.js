const express = require('express')
const SPM = require('../models/spmModel')
const {
    addSPM, SPMs,spm_id
} = require('../controllers/spmController')
const {client_id} = require("../controllers/clientController");

const router = express.Router()


// add spm
router.post('/add', addSPM)

router.post('/spms', SPMs)

router.get('/spm/:id', spm_id)


module.exports = router

