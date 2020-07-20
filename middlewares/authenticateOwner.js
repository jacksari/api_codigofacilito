module.exports = function(req, res, next) {
    if (req.mainObj && (req.mainObj._user == req.user.id)) return next();

    next(new Error('No tienes los permisos para modificar estso registros'));

}