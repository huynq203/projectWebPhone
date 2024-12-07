const commentModel = require('../../models/comment');
const pagnigation = require('../../../common/pagnigation');
const moment = require('moment');

const index = async (req, res) => {
    const accountLogin = req.session.account;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    //bo qua bao nhieu du lieu
    const skip = page * limit - limit;
    //xem có bao nhieu du lieu
    const totalRow = await commentModel.find().countDocuments();
    //tong co bao nhieu trang
    const totalPage = Math.ceil(totalRow / limit);
    //tro ve truoc
    const prev = page - 1;
    //check de co tro ve truoc duoc khong
    const hasPrev = (page > 1) ? true : false;
    //tro ve sau
    const next = page + 1;
    //check de tro ve sau duoc k
    const hasNext = (page < totalPage) ? true : false;
    const comments = await commentModel.find()
        .populate({ path: "pro_id" })
        .populate({ path: "customer_id" })
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip)
    res.render('admin/comments/index', {
        comments,
        accountLogin,
        pages: pagnigation(page, totalPage),
        next,
        hasNext,
        prev,
        hasPrev,
        moment
    });
}
const edit = async (req, res) => {
    const id = req.params.id;
    const comment = await commentModel.findById(id)
        .populate({ path: "customer_id" })
        .populate({ path: "pro_id" });
    res.render('admin/comments/edit', { comment });
}
const update = (req, res) => {

}
const destroy = (req, res) => {

}

module.exports = {
    index,
    edit,
    update,
    destroy
}