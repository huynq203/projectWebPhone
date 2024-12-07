
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
        require: true,
        text: true
    },
    email: {
        type: String,
        require: true,
        text: true
    },
    phone: {
        type: String,
        default: null,
        text: true
    },
    role: {
        type: String,
        default: 'member'
    }
});
module.exports = mongoose.model('Admin', adminSchema, 'admins');