const express = require('express')
const router = express.Router()
const fileModel = require('../models/files.model')
const upload = require('../config/multer.config')
const authMiddleware = require('../middlewares/authe')
const cloudinary = require('../config/cloudinary.config')
const file = require('../models/files.model')

router.get('/home', authMiddleware, async (req, res) => {

    const userFiles = await fileModel.find({
        user: req.user.userID
    })

    console.log(userFiles)

    res.render('home', {
        files: userFiles,
    })
})

router.post('/upload',authMiddleware, upload.single('file'), async (req, res) => {
    const newFile = await fileModel.create({
        path: req.file.path,
        originalname: req.file.originalname,
        user: req.user.userID,
    })

    res.json(newFile);
})

router.get('/download/:path', authMiddleware, async (req, res) => {
    const loggedInUserID = req.user.userID
    const path = req.params.path

    const file = await fileModel.findOne({
        user: loggedInUserID,
        path: path,
    })

    if (!file) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    res.redirect(path);

})

module.exports = router