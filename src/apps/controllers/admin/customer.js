const customerModel = require('../../models/customer');
const pagnigation = require('../../../common/pagnigation')

const index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    //bo qua bao nhieu du lieu
    const skip = page * limit - limit;
    //xem có bao nhieu du lieu
    const totalRow = await customerModel.find().countDocuments();
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
    const customers = await customerModel.find()
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip)
    res.render('admin/customers/index', {
        customers,
        pages: pagnigation(page, totalPage),
        next,
        hasNext,
        prev,
        hasPrev,
    });
}
const edit = async (req, res) => {
    const id = req.params.id;
    const customer = await customerModel.findById(id);
    res.render('admin/customers/edit', { customer });
}
const update = async (req, res) => {
    const id = req.params.id;
    const { fullname, email, phone } = req.body;
    const customer = { fullname, email, phone };
    await customerModel.findByIdAndUpdate(id, customer);
    res.redirect('/admin/customers');

}
const destroy = (req, res) => {
    
}
module.exports = {
    index,
    edit,
    update,
    destroy
}