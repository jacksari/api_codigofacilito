const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.post('save', function(user, next) {
    User.countDocuments({}).then(resp => {
        if (resp == 1) {
            User.findOneAndUpdate({ '_id': user._id }, { admin: true }, { new: true }).then(resp => {
                    this.admin = true;
                    next();
                })
                // user.admin = true;
                // user.save().then(next);
        } else {
            next();
        }
    })
})

userSchema.virtual('places').get(function() {
    return Place.find({ '_user': this._id });
})

userSchema.plugin(require('mongoose-bcrypt'));

const User = mongoose.model('User', userSchema);

module.exports = User;