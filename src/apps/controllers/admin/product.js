const productModel = require('../../models/product');
const categoryModel = require('../../models/category');
const pagnigation = require('../../../common/pagnigation');
const slug = require('slug');
const fs = require('fs');
const path = require('path');

const index = async (req, res) => {
    res.render("admin/products/index");
}

const create = async (req, res) => {
    res.render('admin/products/create');
}
const store = async (req, res) => {
    const { file, body } = req;
    const product = {
        name: body.name,
        price: body.price,
        cat_id: body.cat_id,
        description: body.description,
        status: body.status,
        featured: body.featured == 1 ? true : false,
        promotion: body.promotion,
        warranty: body.warranty,
        accessories: body.accessories,
        is_stock: body.is_stock == 1 ? true : false,
        slug: slug(String(body.name), '-'),
    }

    if (file) {
        const thumbnail = "products/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
        product['thumbnail'] = thumbnail;
        await productModel(product).save();
        res.redirect("/admin/products");
    } else {
        await productModel(product).save();
        res.redirect("/admin/products");
    }
}
const edit = async (req, res) => {
    const id = req.params.id;
    const product = await productModel.findById(id).populate({ path: 'cat_id' });
    const categories = await categoryModel.find().exec();
    const listcategory = categories.filter((item) => !item._id.equals(product.cat_id._id));
    res.render('admin/products/edit', { listcategory, product });
}
const update = async (req, res) => {
    const id = req.params.id;
    const { file, body } = req;
    const product = {
        name: body.name,
        price: body.price,
        cat_id: body.cat_id,
        description: body.description,
        status: body.status,
        featured: body.featured == 1 ? true : false,
        promotion: body.promotion,
        warranty: body.warranty,
        accessories: body.accessories,
        is_stock: body.is_stock == 1 ? true : false,
        slug: slug(String(body.name), '-'),
    }
    if (file) {
        const thumbnail = "products/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
        product["thumbnail"] = thumbnail;
        await productModel.findByIdAndUpdate(id, product).exec();
        res.redirect('/admin/products');
    } else {
        await productModel.findByIdAndUpdate(id, product).exec();
        res.redirect('/admin/products');
    }

}
const destroy = async (req, res) => {
    const id = req.params.id;
    const product = await productModel.findOne({ _id: id });
    const thumbnail = product.thumbnail;
    const pathImage = path.resolve('src/public/images/', thumbnail);
    const result = await productModel.findByIdAndDelete(id).exec();
    if (result) {
        if (pathImage == "") {
            res.redirect('/admin/products');
        } else {
            fs.unlink(pathImage, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Delete File successfully.");
                }
            });
            res.redirect('/admin/products');
        }
    }
}


const search = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    //bo qua bao nhieu du lieu
    const skip = page * limit - limit;
    const keyword = req.query.keyword;
    const products = await productModel.find({
        $text: {
            $search: keyword,
        }
    })
        .populate({ path: "cat_id" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
    //xem có bao nhieu du lieu
    const totalRow = products.length;
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
    res.render('admin/products/search', {
        products,
        pages: pagnigation(page, totalPage),
        next,
        hasNext,
        prev,
        hasPrev,
        keyword
    });
}

module.exports = {
    index,
    create,
    store,
    edit,
    update,
    destroy,
    search
}