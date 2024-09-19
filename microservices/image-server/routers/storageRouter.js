const express = require('express');
const multer = require('multer')
const fs = require('fs');

const router = express.Router();
const upload = multer();
const { v4: uuidv4 } = require('uuid');



//Authentication token middleware
router.use('/', (req, res, next) => {

    if (req.headers["authentication"] === process.env.AUTHENTICATION_TOKEN) {
        req.publicUrl = `${req.protocol}://${req.get('host')}` + req.originalUrl.substring(0, req.originalUrl.lastIndexOf('/storage')) + '/public';
        next()
    }
    else res.status(401).json({
        message: "Wrong authentication token!",
        status: "Error!"
    })
});


//image and filename in request
router.put('/uploadOne', upload.single('image'), (req, res) => {
    const isRandomName = req.body.isRandomName;
    try {
        if (!fs.existsSync("public/")){
            fs.mkdirSync("public/");
        }
        
        const suffix = req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1)
        let filename;
        if (isRandomName) {
            filename = `${uuidv4()}.${suffix}`
        } else if (req.body.filename) {
            filename = req.body.filename;

        } else {
            filename = req.file.originalname;
        }
        try {
            fs.writeFileSync(`public/${filename}`, req.file.buffer);
            // file written successfully
        } catch (err) {
            console.error(err);
        }
        res.status(200).json({
            status: "Success!",
            filename: filename,
            url: `${req.publicUrl}/${filename}`
        })
    } catch (e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
})

router.put('/uploadBatch', upload.array('images'), (req, res) => {
    const isRandomName = req.body.isRandomName;
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    try {
        if (!fs.existsSync("public/")){
            fs.mkdirSync("public/");
        }
        const filenames = [];
        const urls = [];
        req.files.forEach((file) => {
            const suffix = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
            let filename;
            if (isRandomName) {
                filename = `${uuidv4()}.${suffix}`
            } else {
                filename = file.originalname;
            }
            try {
                fs.writeFileSync(`public/${filename}`, file.buffer);
                // file written successfully
                filenames.push(filename);
                urls.push(`${req.publicUrl}/${filename}`);
            } catch (err) {
                console.error(err);
            }
        });

        res.status(200).json({
            status: "Success!",
            filenames: filenames,
            urls: urls
        })

    } catch (e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
})

router.delete('/remove', (req, res) => {
    const imageNames = req.body.imageNames;
    try {
        imageNames.forEach( (imageName) => {
            try {
            fs.rmSync(`public/${imageName}`);
            } catch(e) {

            } 
        } )
        res.status(200).json({
            status: "Success!",
        })

    } catch(e) {
        res.status(500).json({
            status: "Error!",
            message: e.message
        })
    }
})

const storageRouter = router;
module.exports = storageRouter;