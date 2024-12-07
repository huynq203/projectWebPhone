const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    body: {
        type: String,
        require: true
    },
    pro_id: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        require: true
    },
    customer_id: {
        type: mongoose.Types.ObjectId,
        ref: "Customer",
        require: true
    },
    active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema, 'comments');