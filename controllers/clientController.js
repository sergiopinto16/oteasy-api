require('dotenv').config()

const Client = require('../models/clientModel')

const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendSlackNotification = require('../slackNotifications')
const SessionReport = require("../models/sessionReportModel");


const secret = process.env.SECRET;



// register client
// app.post('/register',
const registerClient = async (req, res) => {

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        console.log(req.body)

        const { card_id, name, email, birth_date, address, parent_name, contact_number } = req.body;
        console.log(card_id)
        console.log(name)
        console.log(email)
        console.log(parent_name)
        console.log(info)

        //TODO : Check if card_id exist (new user)
        const clientDoc = await Client.findOne({ card_id }).lean();
        console.log(clientDoc)
        if (clientDoc !== null) {
            res.status(400).json('User already exist!');
        }
        else {
            try {
                const clientDoc = await Client.create({
                    card_id,
                    name,
                    email,
                    birth_date,
                    address,
                    parent_name, contact_number,
                    doctor: info.id
                });
                res.json(clientDoc);
                sendSlackNotification(JSON.stringify(clientDoc), "DB-clientRegister")
            } catch (e) {
                console.log(e);
                res.status(400).json(e);
            }
        }

    });


}


// get all clients
// app.get('/clients',
const clients = async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        console.log(info)
        //TODO - filter by utent
        //const clients = await Client.find({}).sort({createdAt: -1})
        //SessionReport.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20)
        var query = { doctor: info.id };
        const clients = await Client.find(query).sort({createdAt: -1})

        res.status(200).json(clients)
    });
}


// get one Client Info
// app.get('/client/:id',
const client_id = async (req, res) => {
    const {token} = req.cookies;
    const {id} = req.params;
    console.log(id)
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        //TODO - filter by user login
        // const sessionReports = await SessionReport.findById(id).populate('author', ['username']);
        var query = { doctor: info.id, _id: id};
        const client = await Client.findById(query).sort({createdAt: -1})
        res.status(200).json(client)
    });
}

module.exports = {
    registerClient,
    clients,
    client_id
}