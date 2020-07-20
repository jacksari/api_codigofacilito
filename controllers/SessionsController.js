const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');
const User = require('../models/User');

function authenticate(req, res, next) {
    let body = req.body;
    User.findOne({ email: body.email })
        .then(user => {
            user.verifyPassword(body.password)
                .then(valid => {
                    if (valid) {
                        req.user = user;
                        next();
                    } else {
                        //next(new Error('Credenciales inválidas - pw'));
                        res.status(402).json({
                            ok: false,
                            error: 'Credenciales inválidas - pw'
                        })
                    }
                }).catch(err => {
                    console.log('Error error');
                })
        }).catch(err => {
            console.log('No hay usuarios con ese correo');

            res.status(400).json({
                ok: false,
                error: 'No hay usuarios con ese correo'
            });

        })


}

function generateToken(req, res, next) {
    if (!req.user) return next();

    req.token = jwt.sign({ id: req.user._id, name: req.user.name },
        secrets.jwtSecrets, { expiresIn: 60 * 60 });
    next();
}

function sendToken(req, res) {
    if (req.user) {
        res.json({
            ok: true,
            usuario: req.user,
            jwt: req.token
        })
    } else {
        res.status(422).json({
            ok: false,
            error: 'No se pudo crear el usuario'
        })
    }


}

module.exports = {
    generateToken,
    sendToken,
    authenticate
}