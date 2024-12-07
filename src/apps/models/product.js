const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    cat_id: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        require: true
    },
    status: {
        type: String,
        default: null
    },
    featured: {
        type: Boolean,
        default: false
    },
    promotion: {
        type: String,
        default: null
    },
    warranty: {
        type: String,
        default: null
    },
    accessories: {
        type: String,
        default: null
    },
    is_stock: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        text: true,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
});
//tham số 1 : đặt tên , tham số 2 : lấy schema trên xuống ,tham số thứ 3 chiếu đến bảng
module.exports = mongoose.model('Product', productSchema, 'products');