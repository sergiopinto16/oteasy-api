
const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("bezkoder-e-commerce");


const upload = async (req, res) => {
    try {
        await processFile(req, res);

        if (!req.files) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        const files = req.files;
        const clientID = req.body['clientID'];

        console.log(files.length);
        console.log("client_id = ", clientID);

        for (let i_file = 0; i_file < files.length; i_file++) {

            file = files[i_file]
            // Create a new blob in the bucket and upload the file data.
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream.on("error", (err) => {
                res.status(500).send({message: err.message});
            });

            blobStream.on("finish", async (data) => {
                // Create URL for directly file access via HTTP.
                const publicUrl = format(
                    //TODO - add client_id folder
                    `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                );

                try {
                    // Make the file public
                    await bucket.file(file.originalname).makePublic();
                } catch {
                    return res.status(500).send({
                        message:
                            `Uploaded the file successfully: ${file.originalname}, but public access is denied!`,
                        url: publicUrl,
                    });
                }

                res.status(200).send({
                    message: "Uploaded the file successfully: " + file.originalname,
                    url: publicUrl,
                });
            });

            blobStream.end(req.file.buffer);
        }
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req.files}. ${err}`,
        });
    }
};


const getListFiles = async (req, res) => {
...
};

const download = async (req, res) => {
...
};

module.exports = {
    upload,
    getListFiles,
    download,
};

