const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const user = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 10 }),
    body('Username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array(),
                message: 'Invalid Data,'
            })
        }
        const { Username, email, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({
            Username,
            email,
            password: hashPassword,
        })
        res.send(newUser)
    })

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',
    body('Username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),

    async (req, res) => {

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                error: errors.array(),
                message: 'Invalid Data'
            })
        }

        const {Username, password} = req.body;

        const user = await userModel.findOne({
            Username: Username,
        })

        if (!user) {
            return res.status(400).json({
                message: 'Username or password is incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({
                message: 'Username or password is incorrect'
            })
        }

        const token = jwt.sign({
            userID: user._id,
            email: user.email,
            Username: user.Username,
        },
        process.env.JWT_SECRET,
    )

    res.cookie('token', token)

    res.send('Logged In')

    })

    

module.exports = router