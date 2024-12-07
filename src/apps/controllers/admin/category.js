const categoryModel = require('../../models/category');
const pagnigation = require('../../../common/pagnigation');
const slug = require('slug');

const index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = page * limit - limit;
    const totalRow = await categoryModel.find().countDocuments();
    const totalPage = Math.ceil(totalRow / limit);
    const prev = page - 1;
    const hasPrev = (page > 1) ? true : false;
    const next = page + 1;
    const hasNext = (page < totalPage) ? true : false;
    const categories = await categoryModel
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
    res.render("admin/categories/index", {
        categories,
        pages: pagnigation(page, totalPage),
        next,
        hasNext,
        prev,
        hasPrev,
        data: {},
    });
}
const create = async (req, res) => {
    res.render('admin/categories/create');
}
const store = async (req, res) => {
    const { body } = req;
    const category = {
        title: body.title,
        description: (body.description) == "" ? "null" : body.description,
        slug: slug(body.title),
    }
    new categoryModel(category).save();
    res.redirect("/admin/categories");

}
const edit = async (req, res) => {
    const id = req.params.id;
    const category = await categoryModel.findById(id);
    res.render('admin/categories/edit', { category });
}

const update = async (req, res) => {
    const id = req.params.id;
    const { body } = req;
    const category = {
        title: body.title,
        slug: slug(body.title),
        description: (body.description) == "" ? "null" : body.description
    }
    await categoryModel.findByIdAndUpdate(id, category).exec();
    res.redirect('/admin/categories');
}

const destroy = async (req, res) => {
    const id = req.params.id;
    await categoryModel.findByIdAndDelete(id).exec();
    res.redirect('/admin/categories');
}


module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy
}