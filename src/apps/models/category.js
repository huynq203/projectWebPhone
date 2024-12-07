const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        default:null
    },
    slug:{
        type:String,
        require:true
    },
});
//tham số 1 : đặt tên , tham số 2 : lấy schema trên xuống ,tham số thứ 3 chiếu đến bảng
module.exports = mongoose.model('Category',categorySchema,'categories');