require('dotenv').config()

const SessionReport = require('../models/sessionReportModel')
const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendSlackNotification = require('../slackNotifications')
const Client = require("../models/clientModel");

const secret = process.env.SECRET;

// add session report
// app.post('/add',
const addSessionReport = async (req, res) => {

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        //const { car_plate, car_km, quantity, price } = req.body;
        const {date, summary, content, client_id} = req.body;
        console.log(req.body)

        //TODO - get client id (same in spm report)

        const sessionReportAdd = await SessionReport.create({
            date,
            summary,
            content,
            client: client_id,
            author: info.id,
        });
        res.json(sessionReportAdd);
        sendSlackNotification(JSON.stringify(sessionReportAdd), "DB-sessionReport")
    });

    // try {
    //     const gasReportAdd = await Gas.create({
    //         car_plate,
    //         car_km,
    //         quantity,
    //         price,
    //     });
    //     res.json(gasReportAdd);
    // } catch (e) {
    //     console.log(e);
    //     res.status(400).json(e);
    // }


}



//PUT

// update session report
// app.put('/post',
const updateSessionReport = async (req, res) => {

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        //const { car_plate, car_km, quantity, price } = req.body;
        const {id,date, summary, content} = req.body;
        console.log(req.body)

        //TODO - get client id (same in spm report)
        const sessionReportDoc = await SessionReport.findById(id);
        const isAuthor = JSON.stringify(sessionReportDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }

        const sessionReportUpdate = await SessionReport.update({
            date,
            summary,
            content
        });
        res.json(sessionReportUpdate);
        sendSlackNotification(JSON.stringify(sessionReportUpdate), "DB-sessionReport")
    });

    // try {
    //     const gasReportAdd = await Gas.create({
    //         car_plate,
    //         car_km,
    //         quantity,
    //         price,
    //     });
    //     res.json(gasReportAdd);
    // } catch (e) {
    //     console.log(e);
    //     res.status(400).json(e);
    // }


}




// get all Session Reports
// app.post('/sessionReports',
const sessionReports = async (req, res) => {

    const {token} = req.cookies;
    const {client_id} = req.body;
    console.log(client_id)
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        console.log(info)
        console.log("session - client_id = " + client_id )

        //filter by utent
        var query = { author: info.id, client: client_id };
        const sessionReports = await SessionReport.find(query).sort({createdAt: -1})
        res.status(200).json(sessionReports)
    });
}


// get one Session Reports
// app.get('/sessionReports/:id',
const sessionReport_id = async (req, res) => {
    const {token} = req.cookies;
    const {id} = req.params;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        //TODO - filter by user login
        // const sessionReports = await SessionReport.findById(id).populate('author', ['username']);
        const sessionReports = await SessionReport.find(id).sort({createdAt: -1})
        res.status(200).json(sessionReports)
    });
}

/*

// POST
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });

});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }
        await postDoc.update({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });

        res.json(postDoc);
    });

});

app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})
*/


module.exports = {
    addSessionReport,
    updateSessionReport,
    sessionReports,
    sessionReport_id
}