const User = require('../models/User');
const buildParams = require('./helpers').bulidParams;

const validParams = ['email', 'name', 'password'];

function create(req, res, next) {

    let body = req.body;
    let params = buildParams(validParams, body);


    User.create(params)
        .then(user => {
            req.user = user;
            next();

        })
        .catch(err => {
            console.log(err);
            res.status(422).json({
                ok: false,
                message: 'Error al crear usuario',
                error: err
            })
        })
}

function myPlaces(req, res) {
    User.find({ '_id': req.user.id }).then(resp => {
        user.places.then(places => {
            res.json(places)
        })
    }).catch(err => {
        res.json(err)
    })
}


module.exports = {
    create,
    myPlaces
}