const mongoose = require('mongoose');
const uploader = require('../models/Uploader');
const mongoosePaginate = require('mongoose-paginate');
const slugify = require('../plugins/slugify');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Eltítulo debe ser obligatorio']
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    acceptsCreditCard: {
        type: Boolean,
        default: false
    },
    coverImage: {
        type: String
    },
    avatarImage: {
        type: String
    },
    openHour: Number,
    closeHour: Number,
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        resf: 'User',
        required: true
    }
});



placeSchema.methods.updateImage = function(path, imageType) {
    //primero subir la imagen


    //Segundo guardar la imagen
    return uploader(path)
        .then(secure_url => {
            this.saveImageUrl(secure_url, imageType)
        });
}

placeSchema.methods.saveImageUrl = function(secure_url, imageType) {
    this[imageType + 'Image'] = secure_url;
    return this.save();
}

placeSchema.pre('save', function(next) {
    if (this.slug) return next();
    generateSlugAndContinue.call(this, 0, next);

})

function generateSlugAndContinue(count, next) {
    this.slug = slugify(this.title);
    if (count != 0)
        this.slug = this.slug + '-' + count;

    Place.validateSlugCount(this.slug).then(isValid => {
        if (!isValid)
            return generateSlugAndContinue.call(this, count + 1, next);

        next();
    })

    console.log('SLUG', this.slug);
}

placeSchema.statics.validateSlugCount = function(slug) {
    return Place.countDocuments({ slug: slug }).then(resp => {
        if (resp > 0) {
            console.log('QWEQWE: ', resp);
            return false;
        }
        return true
    })
}

placeSchema.plugin(mongoosePaginate);

let Place = mongoose.model('Place', placeSchema);

module.exports = Place;