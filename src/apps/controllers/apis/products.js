const productModel = require('../../models/product');
const categoryModel = require('../../models/category');
const pagnigation = require('../../../common/pagnigation');
const slug = require('slug');
const fs = require('fs');
const path = require('path');

const index = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = page * limit - limit;
    const totalRow = await productModel.find().countDocuments();
    const totalPage = Math.ceil(totalRow / limit);
    const prev = page - 1;
    const next = page + 1;
    const hasNext = page < totalPage ? true : false;
    const hasPrev = page > 1 ? true : false;
    const products = await productModel
        .find()
        .populate({ path: "cat_id" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
    const totalProducts = products.length;
    res
        .status(200)
        .json({
            status: "Success",
            filter: {
                totalProducts,
                page,
                limit
            },
            data: {
                docs: products,
                pages: {
                    totalpage: totalPage,
                    pages: pagnigation(page, totalPage),
                    next,
                    hasNext,
                    prev,
                    hasPrev,
                }
            }
        })
}

const create = async (req, res) => {
    const categories = await categoryModel.find();
    res
        .status(200)
        .json({
            status: "Success",
            data: {
                docs: categories,
            }
        })
}


const store = async (req, res) => {
    const { file, body } = req;
    const product = {
        name: body.name,
        price: body.price,
        cat_id: body.cat_id,
        description: body.description,
        status: body.status,
        featured: Number(body.featured) == 1 ? true : false,
        promotion: body.promotion,
        warranty: body.warranty,
        accessories: body.accessories,
        is_stock: Number(body.is_stock) == 1 ? true : false,
        slug: slug(String(body.name), '-'),
    }

    if (file) {
        const thumbnail = "products/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
        product['thumbnail'] = thumbnail;
        await productModel(product).save();
    } else {
        await productModel(product).save();
    }
    res
        .status(201)
        .json({
            status: "Success",
            messages: "Thêm thành công",
        });
}

const edit = async (req, res) => {

}
const update = async (req, res) => {

}
const destroy = async (req, res) => {
    const id = req.params.id;
    const product = await productModel.findOne({ _id: id });
    const thumbnail = product.thumbnail;
    const pathImage = path.resolve('src/public/images/', thumbnail);
    const result = await productModel.findByIdAndDelete(id).exec();
    if (result) {
        if (pathImage == "") {
            res
                .status(204)
                .json({
                    status: "Thành công",
                    messages: "Đã xóa thành công"
                })
        } else {
            fs.unlink(pathImage, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Delete File successfully.");
                }
            });
            res
                .status(204)
                .json({
                    status: "Thành công",
                    messages: "Đã xóa thành công"
                })
        }
    }

}

module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy
}