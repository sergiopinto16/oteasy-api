// service.js
const { google } = require('googleapis');
const path = require('path');

const getDriveService = () => {
    const KEYFILEPATH = path.join(__dirname, 'vesito-284096f577dd.json');
    const SCOPES = ['https://www.googleapis.com/auth/drive'];

    console.log('getDriveService = ', KEYFILEPATH)
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES,
    });
    const driveService = google.drive({ version: 'v3', auth });
    return driveService;
};

module.exports = getDriveService;