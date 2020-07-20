var express = require('express');
var router = express.Router();

const placesController = require('../controllers/PlacesController');
const authenticateOwner = require('../middlewares/authenticateOwner');

router.route('/')
    .get(placesController.index)
    .post(
        placesController.multerMiddleware(),
        placesController.create,
        placesController.saveImage
    );

router.route('/:id')
    .get(placesController.show)
    .put(placesController.update)
    .delete(placesController.destroy);

module.exports = router;