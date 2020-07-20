const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UsersController');
const sessionController = require('../controllers/SessionsController');

router.route('/')
    .post(
        sessionController.authenticate,
        sessionController.generateToken,
        sessionController.sendToken
    )



module.exports = router;