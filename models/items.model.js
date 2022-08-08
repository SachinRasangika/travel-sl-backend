const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Items = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String
    },
    image: {
        type: [],
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('items', Items);