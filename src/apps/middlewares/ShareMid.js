const categoryModel = require('../models/category');
module.exports = async (req, res, next) => {
    res.locals.categories = await categoryModel.find();
    res.locals.totalCart = req.session.cart.reduce((total, item) => total + item.qty, 0);
    res.locals.accountCustomer = req.session.accountCustomer;
    res.locals.accountAdmin = req.session.accountAdmin;
    next();
}