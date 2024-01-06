require('dotenv').config()

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const Post = require('./models/postModel');

const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');

const userRoutes = require('./routes/users')
const gasRoutes = require('./routes/gas')
const spmRoutes = require('./routes/spm')
const clientRoutes = require('./routes/client')
const sessionReportRoutes = require('./routes/sessionReport')
const uploadRoutes = require('./routes/upload')


const sendSlackNotification = require('./slackNotifications')
const {sessionReports} = require("./controllers/sessionReportController");

// Add timestamp 
sendSlackNotification("APP start")

// TODO How to connect multiple urls ???
app.use(cors({credentials: true, origin: process.env.URL_PRIVILEGIES}));
// middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// ???????
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


// routes
app.use('/api/client/', clientRoutes)
app.use('/api/user/', userRoutes)
app.use('/api/gas/', gasRoutes)
app.use('/api/spm/', spmRoutes)
app.use('/api/sessionReport/', sessionReportRoutes)
app.use('/api/upload/', uploadRoutes)


//app.listen(3010);
// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to mongo db & listening on port ' + process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })


// TODO - if error in mongo db connection execute app.listen
// app.listen(process.env.PORT)


// POST
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, summary, content} = req.body;
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
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id, title, summary, content} = req.body;
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
            .sort({createdAt: -1})
            .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})


// ??? - list to not close ??
app.listen(4000)