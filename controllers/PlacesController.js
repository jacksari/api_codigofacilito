const Place = require('../models/Place');
const upload = require('../config/upload');
const uploader = require('../models/Uploader');

function find(req, res, next) {
    Place.findById(req.params.id)
        .then(place => {
            req.place = place;
            next();
        })
        .catch(err => {
            next(err);
        });
}

function index(req, res) {
    let page = req.query.page;
    Place.paginate({}, { page: page || 1, limit: 10, sort: { '_id': -1 } }, (err, places) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando places',
                erros: err
            });
        }
        res.json({
            ok: true,
            places
        });
    });
}

function create(req, res, next) {
    let body = req.body;
    console.log('123123345345', body);
    var place = new Place({
        title: body.title,
        description: body.description,
        acceptsCreditCard: body.acceptsCreditCard,
        openHour: body.openHour,
        closeHour: body.closeHour,
        _user: req.user.id
    });
    console.log('user:', req.user);
    place.save({ new: true, runValidators: true }).then(resp => {
        req.place = resp;
        req.mainObj = place;
        next();
    }).catch(err => {
        console.log('Error', err);
        next(err);
    })
}

function show(req, res) {
    let id = req.params.id;
    console.log(id);

    Place.findOne({ slug: id }, (err, placeEncontrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar places',
                errores: err
            });
        }
        if (!placeEncontrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El place con el id ' + id + ' no existe',
                erros: { message: 'No existe un place con ese ID', err }
            });
        }
        res.json({
            ok: true,
            place: placeEncontrado
        })
    });
}


function update(req, res) {
    let id = req.params.id;
    let body = req.body
    Place.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, placeEncontrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El place con el id: ' + id + ' no existe',
                erros: { message: 'No existe un place con ese ID' }
            });
        };
        res.json({
            ok: true,
            place: placeEncontrado
        });
    });
}

function destroy(req, res) {
    let id = req.params.id;
    Place.findByIdAndDelete(id, (err, placeEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El place con el id: ' + id + ' no existe',
                erros: { message: 'No existe un place con ese ID' }
            });
        };
        res.json({
            ok: true,
            mensaje: 'Place eliminado correctamente',
            place: placeEliminado
        });
    })
}

function multerMiddleware() {
    return upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]);
}

function saveImage(req, res) {
    if (req.place) {
        const files = ['avatar', 'cover'];
        const promises = [];

        files.forEach(imageType => {
            if (req.files && req.files[imageType]) {
                const path = req.files[imageType][0].path;
                console.log('PATH', path);
                promises.push(req.place.updateImage(path, imageType));
            }
        })
        Promise.all(promises).then(resp => {
            console.log(resp);
            res.json({
                ok: true,
                place: req.place
            });
        }).catch(err => {
            console.log('err', err);
            res.json({
                ok: false,
                err
            });
        })


    } else {
        res.status(422).json({
            error: req.error || 'Could not save place'
        });
    }
}

module.exports = {
    index,
    create,
    show,
    update,
    destroy,
    multerMiddleware,
    saveImage
}