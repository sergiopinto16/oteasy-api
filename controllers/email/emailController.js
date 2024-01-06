const User = require('../../models/userModel')
const sendEmail = require('./emailSend')
const msgs = require('./emailMsgs')
const templates = require('./emailTemplates')

// The callback that is invoked when the user submits the form on the client.
const collectEmail = async (req, res) => {
  const { email } = req.body

  User.findOne({ email })
    .then(user => {

      // We have a new user! Send them a confirmation email.
      if (!user) {
        User.create({ email })
          .then(newUser => sendEmail(newUser.email, templates.confirm(newUser._id)))
          .then(() => res.json({ msg: msgs.confirm }))
          .catch(err => console.log(err))
      }

      // We have already seen this email address. But the user has not
      // clicked on the confirmation link. Send another confirmation email.
      else if (user && !user.confirmed) {
        sendEmail(user.email, templates.confirm(user._id))
          .then(() => res.json({ msg: msgs.resend }))
      }

      // The user has already confirmed this email address
      else {
        res.json({ msg: msgs.alreadyConfirmed })
      }

    })
    .catch(err => console.log(err))
}

// The callback that is invoked when the user visits the confirmation
// url on the client and a fetch request is sent in componentDidMount.
const confirmEmail = async (req, res) => {
  const { id } = req.params
  console.log(id)
  User.findById(id)
    .then(user => {

      // A user with that id does not exist in the DB. Perhaps some tricky 
      // user tried to go to a different url than the one provided in the 
      // confirmation email.
      if (!user) {
        res.json({ msg: msgs.couldNotFind })
      }

      // The user exists but has not been confirmed. We need to confirm this 
      // user and let them know their email address has been confirmed.
      else if (user && !user.confirmed) {
        User.findByIdAndUpdate(id, { confirmed: true, credentials_level:[1,0,0,0,0,0,0,0,0,0]})
          .then(() => res.json({ msg: msgs.confirmed }))
          .catch(err => console.log(err))
      }

      // The user has already confirmed this email address.
      else {
        res.json({ msg: msgs.alreadyConfirmed })
      }

    })
    .catch(err => console.log(err))
}



module.exports = {
  collectEmail,
  confirmEmail
}

// {"_id":{"$oid":"64ae7da50be5fed1017145cf"},
// "name":"Sérgio (x)",
// "email":"xergio.17@gmail.com",
// "password":"$2a$10$4StZQQr0467/pPZaMYs5YON2T9/yCvdC2JMtYwTdpMYsrD/o7kh2O",
// "credentials_level":[{"$numberInt":"0"},{"$numberInt":"0"},{"$numberInt":"0"},{"$numberInt":"0"},{"$numberInt":"0"},{"$numberInt":"0"},{"$numberInt":"0"},{"$numberInt":"0"},{"$numberInt":"0"},{"$numberInt":"0"}],
// "confirmed":true,
// "__v":{"$numberInt":"0"}}