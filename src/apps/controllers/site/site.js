const productModel = require('../../models/product');
const categoryModel = require('../../models/category');
const customerModel = require('../../models/customer');
const pagnigation = require('../../../common/pagnigation');
const commentModel = require('../../models/comment');
const moment = require('moment');
const transporter = require('../../../common/transposter');
const ejs = require('ejs');
const path = require('path');
const bcrypt = require('bcrypt');

const getLogin = (req, res) => {
    console.log();
    res.render('site/login', { data: {} });
}
const postLogin = async (req, res) => {
    const { account, password } = req.body;
    const checkCustomer = await customerModel.findOne({
        account: account,
    });
    if (checkCustomer) {
        bcrypt.compare(password, checkCustomer.password, function (err, result) {
            if (result) {
                if (req.session.returnTo) {
                    req.session.accountCustomer = account;
                    const returnUrl = req.session.returnTo;
                    delete req.session.returnTo;
                    res.redirect(returnUrl);
                } else {
                    req.session.accountCustomer = account;
                    res.redirect('/');
                }

            } else {
                error = "Tài khoản hoặc mật khẩu không chính xác";
                res.render('site/login', { data: { error } });
            }
        });
    } else {
        error = "Tài khoản chưa được đăng ký";
        res.render('site/login', { data: { error } });
    }

}
const getLogout = (req, res) => {
    delete req.session.accountCustomer;
    res.redirect('/');
}
const getRegister = (req, res) => {
    res.render('site/register', { data: {} });
}
const postRegister = async (req, res) => {
    const { fullname, phone, email, account, password } = req.body;
    let encryptedPassword = '';
    const saltRounds = 10;
    const checkCustomer = await customerModel.find({
        account: account,
        email: email
    });
    if (checkCustomer.length > 0) {
        tbloi = "Tài khoản hoặc email đã tồn tại";
        res.render('site/register', { data: { tbloi } });
    } else {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, async function (err, hash) {
                encryptedPassword = hash
                const user = {
                    fullname, phoneNumber, email, account, password: encryptedPassword
                }
                await customerModel(user).save();
                tbthanhcong = "Bạn đăng ký thành công giờ bạn có thể đăng nhập";
                res.render('site/register', { data: { tbthanhcong } });

            });
        });
    }
}
const home = async (req, res) => {
    req.session.returnTo = req.originalUrl;
    const featured = await productModel.find({
        featured: true,
        is_stock: true
    }).sort({ _id: -1 })
        .limit(8);
    const productnew = await productModel.find({
        is_stock: true,
    }).sort({ _id: -1 })
        .limit(8);

    res.render('site/index', { featured, productnew });
};

const category = async (req, res) => {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    //bo qua bao nhieu du lieu
    const skip = page * limit - limit;
    //xem có bao nhieu du lieu
    const totalRow = await productModel.find({ cat_id: id }).countDocuments();
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
    const category = await categoryModel.findById(id).exec();
    const products = await productModel.find({
        cat_id: id
    }).sort({ _id: -1 })
        .limit(limit)
        .skip(skip)
    res.render('site/category', {
        category,
        products,
        totalRow,
        pages: pagnigation(page, totalPage),
        next,
        hasNext,
        prev,
        hasPrev,
    });
}

const product = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    //bo qua bao nhieu du lieu
    const skip = page * limit - limit;
    //xem có bao nhieu du lieu
    const totalRow = await productModel.find().countDocuments();
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

    const products = await productModel.find()
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip);
    res.render('site/product', {
        products,
        pages: pagnigation(page, totalPage),
        next,
        hasNext,
        prev,
        hasPrev,
    });
}

const productSingle = async (req, res) => {
    req.session.returnTo = req.originalUrl;
    const id = req.params.id;
    const productSingle = await productModel.findById(id).exec();
    const listProduct = await productModel.find({
        cat_id: productSingle.cat_id
    }).sort({ _id: -1 }).exec();
    const listProductRelated = listProduct.filter((item) => item._id != id);
    const comments = await commentModel.find({
        pro_id: id,
        active: true
    }).sort({ _id: -1 })
        .limit(3);
    res.render('site/productsingle', { productSingle, listProductRelated, comments, moment });
}

const comment = async (req, res) => {
    const pro_id = req.params.id;
    const customer_name = req.session.accountCustomer;
    const customer = await customerModel.findOne({ account: customer_name });
    const { fullname, email, body } = req.body
    const active = false;
    const comment = {
        fullname,
        email,
        body,
        pro_id,
        customer_id: customer._id,
        active,
    }
    await commentModel(comment).save();
    res.redirect(req.path);
}

const search = async (req, res) => {
    const keyword = req.query.keyword || "";

    const products = await productModel.find({
        $text: {
            $search: keyword
        }
    })
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    //bo qua bao nhieu du lieu
    const skip = page * limit - limit;
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

    res.render('site/search', {
        keyword,
        products,
        pages: pagnigation(page, totalPage),
        next,
        hasNext,
        prev,
        hasPrev,
    });
}

const addToCart = async (req, res) => {
    const id = req.body.id;
    const qty = parseInt(req.body.qty);
    const items = req.session.cart;
    let isProductExisis = false;

    //map là dùng để cập nhật lại
    //check xem sản phẩm có hay chưa
    items.map((item) => {
        if (item.id === id) {
            item.qty += qty;
            isProductExisis = true;
        }
        return item;
    });
    if (!isProductExisis) {
        const product = await productModel.findById(id);

        items.push({
            id,
            name: product.name,
            price: product.price,
            thumbnail: product.thumbnail,
            qty,
        });
    }
    req.session.cart = items;
    res.redirect('/cart');
}

const cart = (req, res) => {
    const listCart = req.session.cart;
    req.session.returnTo = req.originalUrl;
    res.render('site/cart', { listCart });
}

//map là dùng để cập nhật lại
const updateCart = (req, res) => {
    const products = req.body.products;
    let items = req.session.cart;
    const newItems = items.map((item) => {
        item.qty = parseInt(products[item.id]["qty"]);
        return item;
    })
    req.session.cart = newItems;
    res.redirect("/cart");
}

const deleteCart = (req, res) => {
    const id = req.params.id;
    let items = req.session.cart;

    //filter là dùng để lọc
    const newItems = items.filter((item) => item.id != id);
    req.session.cart = newItems;
    res.redirect("/cart");
}
const checkout = (req, res) => {
    const listCart = req.session.cart;
    req.session.returnTo = req.originalUrl;
    res.render('site/checkout', { listCart });
}


const order = async (req, res) => {
    const items = req.session.cart;
    const { body } = req;
    const html = await ejs.renderFile(path.join(req.app.get("views"), "site/email-order.ejs"), {
        ...body,
        items
    })


    const info = await transporter.sendMail({
        from: '"MobiShop 👻" <quochuy2011nd@gmail.com>', // sender address
        to: body.email, // list of receivers
        subject: "Xác nhận đơn hàng từ MobiShop", // Subject line
        html, // html body
    });

    req.session.cart = [];
    res.redirect('/success');


}

const success = (req, res) => {
    res.render('site/success');
}
const about = (req, res) => {
    res.render('site/about');
}
const blog = (req, res) => {
    res.render('site/blog');
}
const contact = (req, res) => {
    res.render('site/contact');
}
module.exports = {
    getLogin,
    postLogin,
    getLogout,
    getRegister,
    postRegister,
    home,
    category,
    product,
    productSingle,
    comment,
    search,
    cart,
    addToCart,
    updateCart,
    deleteCart,
    checkout,
    order,
    success,
    about,
    blog,
    contact

}