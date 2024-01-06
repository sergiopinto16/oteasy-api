const express = require('express')
const Users = require('../models/userModel')
const {
    registerUser,
    loginUser,
    profileUser,
    logoutUser
} = require('../controllers/userController')

const { collectEmail, confirmEmail } = require('../controllers/email/emailController')

const router = express.Router()



/*
router.get('/',getUsers)


//GET a single user
router.get('/:id',getUser)

//POST a new user
router.post('/',createUser)

//DELETE a new user
router.delete('/:id',deleteUser)

//UPDATE a new user
//TODO is not working
router.patch('/:id',updateUser)
*/


// register user
router.post('/register', registerUser)


// login user
router.post('/login', loginUser)


// profile User
router.get('/profile', profileUser)


// logout User
router.post('/logout', logoutUser)

router.get('/email', collectEmail)

router.get('/email/confirm/:id', confirmEmail)


module.exports = router

