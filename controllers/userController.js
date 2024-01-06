// https://blog.bitsrc.io/email-confirmation-with-react-257e5d9de725
require('dotenv').config()

const User = require('../models/userModel')
const sendEmail = require('./email/emailSend')
const msgs = require('./email/emailMsgs')
const templates = require('./email/emailTemplates')

const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendSlackNotification = require('../slackNotifications')

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;



// register user
// app.post('/register',
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name)
    console.log(email)
    console.log(password)

    //TODO : Check if email exist (new user)
    const userDoc = await User.findOne({ email }).lean();
    console.log(userDoc)
    if (userDoc !== null) {
        res.status(400).json('User already exist in BD');
    }
    else {
        try {
            const userDocCreated = await User.create({
                name,
                email,
                password: bcrypt.hashSync(password, salt),
            }).then(newUser => {
                sendEmail(newUser.email, templates.confirm(newUser._id));
                console.log(newUser);
                sendSlackNotification(JSON.stringify(newUser), "DB-userRegister");
                res.json(newUser);
            })
                // .then(() => res.json({ msg: msgs.confirm }))
                .catch(err => console.log(err));
        } catch (e) {
            console.log(e);
            res.status(400).json(e);
        }
    }
}


// login user
// app.post('/login',
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const name = "NoUser"
    const userDoc = await User.findOne({ email }).lean();
    console.log(userDoc)
    if (userDoc === null) {
        res.status(400).json('user dont exist');
    }
    else {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            console.log(userDoc)
            // logged in



            jwt.sign({ email, name, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;

                //only send token
                if (userDoc.confirmed) {
                    // res.cookie('token', token).json({
                    //     id: userDoc._id,
                    //     email,
                    //     name: userDoc.name,
                    //     credentials_level: userDoc.credentials_level
                    // });
                    sendSlackNotification(JSON.stringify(userDoc), "DB-userLogin")
                    res.cookie('token', token).json({ sucess: true, err: null });
                }
                else {
                    res.status(401).json('user not confirmed')
                }
            });

        } else {
            res.status(400).json('wrong credentials');
        }
    }
}


// profile User
// app.get('/profile',
const profileUser = async (req, res) => {
    const { token } = req.cookies;
    // const { token } = req.body;
    console.log("ProfileUser token = " + token)

    if (token == null) {
        res.status(400).json("No token");
        return;
    }

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            res.status(400).json(err);
            return;
        }

        // console.log("Return Info = " + info);
        console.log(info.email);
        let token_email = info.email;
        console.log("token_email = " + token_email);
        const userDoc = await User.findOne({ "email": info.email });
        console.log(userDoc)
        //return only name, email, ... (filter)
        res.json({ "email": userDoc.email, "name": userDoc.name, "credentials_level": userDoc.credentials_level });

    });

}


// logout User
// app.post('/logout', 
const logoutUser = (req, res) => {

    //TODO Logout token

    console.log("Logout post")
    const { email } = req.body;
    console.log("email = ", email)
    dict_json = { 'email': email }
    console.log("Send slack = ", dict_json)
    sendSlackNotification(JSON.stringify(dict_json), "DB-userLogout")
    res.cookie('token', '').json('Logout done!');
}
















/*

// get all users
const getUsers = async (req,res) => {
    const users = await User.find({}).sort({createAt: -1})

    res.status(200).json(users)
}

// get a single user
const getUser = async (req,res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }
    const workout = await User.findById(id)

    if(!workout){
        return res.status(404).json({error: 'No such workout'})
    }
    res.status(200).json(workout)
}



// create new user
const createUser = async (req,res) => {
    const {title,load,reps} = req.body
    //add to db
    try{
        const workout = await User.create({title,load,reps})
        res.status(200).json(workout)
    }catch(error){
        res.status(404).json({error: error.message})
    }

}

// delete a user
const deleteUser = async (req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await User.findOneAndDelete({_id: id})
    
    if(!workout){
        return res.status(404).json({error: 'No such workout'})
    }


    res.status(200).json(workout)

}


// update a user
const updateUser = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such workout'})
    }

    const workout = await User.findOneAndUpdate({_id: id}, {
        ...req.body
    })


    if(!workout){
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(workout)

}


module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
}

*/



module.exports = {
    registerUser,
    loginUser,
    profileUser,
    logoutUser
}