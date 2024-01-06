// router.js

const stream = require('stream');
const express = require('express');
const fs = require("fs");
const path = require("path");
const {google} = require("googleapis");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
const parentFolderID = process.env.GOOGLEDRIVE_PARENTFOLDERID;

const KEYFILEPATH = path.join(__dirname, 'vesito-284096f577dd.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];


console.log('getDriveService = ', KEYFILEPATH)
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const drive = google.drive({version: "v3", auth: auth});


//divide check folder from check files
async function checkAndCreateFolder(folderId, folder_name) {
    //check folder
    console.log("Check if folder already exist " + folderId + " " + folder_name)

    let response = await drive.files.list({
        q: `parents in '${folderId}'`,
        fields: 'files(id,name)'
    })

    const files = response.data.files;
    console.log("folders ids = ", files);

    if (files.length) {
        console.log('Files:');
        for (let i_file = 0; i_file < files.length; i_file++) {
            console.log(`${files[i_file].id} | ${files[i_file].name}`);
            if (files[i_file].name === folder_name) {
                console.log("Folder already exist id = ", files[i_file].id)
                return files[i_file].id
            }
        }
    }

    console.log('No folder found.');
    // create folder
    const fileMetaData = {
        name: folder_name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [folderId],
    };


    const res = await drive.files.create({
        fields: "id",
        resource: fileMetaData,
    })
        .catch((err) => console.log(err));
    console.log("Created new folder id = ", res.data);

    return res.data.id


}


// async function createFolder(folderId, folder_name) {
//
//     save_folder_id = await checkFolder(folderId, folder_name)
//
//     console.log("check folder = " + save_folder_id)
//
//     if (save_folder_id.length > 1) {
//         return save_folder_id
//     }
//     // create folder
//     const fileMetaData = {
//         name: folder_name,
//         mimeType: "application/vnd.google-apps.folder",
//         parents: [folderId],
//     };
//
//
//     const res = await drive.files.create({
//         fields: "id",
//         resource: fileMetaData,
//     })
//         .catch((err) => console.log(err));
//     console.log("Created new folder id = ", res.data);
//
//     return res.data.id
//
//
// };

const readFiles = async (folder) => {

    let response = await drive.files.list({
        q: `parents in '${folder}' `,
        fields: 'files(id,name)'
    })

    return response.data.files

};

async function checkFileExist(save_folder_id, file_name) {

    let response = await drive.files.list({

        q: `name='${file_name}' and parents in '${save_folder_id}' `,
        fields: 'files(id,name)'
    })

    if (response.data.files.length > 0) {
        console.log("Item already exist = ", response.data.files)
        return true;
    }

    return false

}

const uploadFile = async (folder, fileObject) => {
    // TODO: add folder_id to config file

    save_folder_id = await checkAndCreateFolder(parentFolderID, folder);

    console.log("folder save id = " + save_folder_id)

    console.log(fileObject.originalname)
    console.log(fileObject.mimetype)
    console.log(fileObject.path)

    response = await checkFileExist(save_folder_id, fileObject.originalname)

    // upload file
    if (response == false) {
        const {data: {id, name} = {}} = await drive.files.create({
            resource: {
                name: fileObject.originalname,
                parents: [save_folder_id],
            },
            media: {
                mimeType: fileObject.mimetype,
                body: fs.createReadStream(fileObject.path),
            },
            fields: 'id,name',
        });
        console.log(`Uploaded file ${name} | ${id} to ${save_folder_id}`);
    }


};


const upload = async (req, res, next) => {
    try {
        // const { body, files } = req;
        // console.log(body)
        // console.log(files)
        const files = req.files;
        const clientID = req.body['clientID'];

        console.log(files.length);
        console.log("client_id = ", clientID);

        for (let i_file = 0; i_file < files.length; i_file++) {

            file = files[i_file]

            console.log(file.filename);
            console.log(file);
            if (!file) {
                const error = new Error('No File')
                error.httpStatusCode = 400
                return next(error)
            }
            // res.send(file);
            await uploadFile(clientID, file)

        }

        res.status(200).send('Data uploaded, ' + files.length + ' files');


    } catch (f) {
        console.log("catch - ", f.message)
        res.send(f.message);
    }
}


const checkFilesInFolder = async (req, res, next) => {
    try {
        const clientID = req.body['clientID'];

        console.log("client_id = ", clientID);

        // res.send(file);
        response = await readFiles(clientID)


        res.status(200).send('Exist files =  ' + response);

    } catch (f) {
        console.log("catch - ", f.message)
        res.send(f.message);
    }
}


const get_url_folderId = async (req, res) => {

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;


        const clientID = req.body['client_id'];

        console.log("client_id = ", clientID);

        // res.send(file);
        save_folder_id = await checkAndCreateFolder(parentFolderID, clientID)

        res.status(200).send({
            'msg': 'Folder url  =  https://drive.google.com/drive/folders/' + save_folder_id,
            'url': 'https://drive.google.com/drive/folders/' + save_folder_id
        });
    });

}


module.exports = {
    upload,
    checkFilesInFolder,
    get_url_folderId
};