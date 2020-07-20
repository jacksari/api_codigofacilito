const mongoose = require('mongoose');

const dbName = 'places_facilito_api';


module.exports = {
    connect: () => mongoose.connect('mongodb://localhost/' + dbName, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }),
    dbName,
    connection: () => {
        if (mongoose.connection)
            return mongoose.connection;
        return this.connect();
    }
}