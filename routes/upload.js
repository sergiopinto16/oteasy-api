const express = require('express')
const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, 'uploads')
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, '${file.originalname}')
//     }
// })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './images/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
    }
});


let upload_multer = multer({ dest: 'uploads/' })

const {
    upload,
    checkFilesInFolder,
    get_url_folderId,
} = require('../controllers/google_drive/googleDriveController')


const router = express.Router()

router.post('/', upload_multer.any(),  upload)

router.post('/checkfiles',  checkFilesInFolder)

router.post('/get_url', get_url_folderId)


// post sessions
// body with client id
//router.post('/upload_video', uploadVideo)


module.exports = router

