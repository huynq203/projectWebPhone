const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    account: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    fullname: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Customer', customerSchema, 'customers');