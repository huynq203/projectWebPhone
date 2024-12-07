const express = require("express");
const router = express.Router();

const AdminController = require("../apps/controllers/admin/admin.js");
const AuthController = require("../apps/controllers/admin/auth.js");
const ProductController = require("../apps/controllers/admin/product.js");
const CategoryController = require("../apps/controllers/admin/category.js");
const CommentController = require("../apps/controllers/admin/comment.js");
const SiteController = require("../apps/controllers/site/site.js");
const CustomerController = require("../apps/controllers/admin/customer.js");
const ApiProduct = require('../apps/controllers/apis/products.js');
//MiddleWare
const AuthMid = require('../apps/middlewares/AuthMid.js');
const UploadMid = require('../apps/middlewares/UploadMid.js');

//router Admin
router.get("/admin/login", AuthMid.checkLogin, AuthController.getLogin);
router.post("/admin/login", AuthController.postLogin);
router.get("/admin/logout", AuthController.getLogout);
router.get("/admin/register", AuthController.getRegister);
router.post("/admin/register", AuthController.postRegister);
router.get("/admin/dashboard", AuthMid.checkAdmin, AdminController.dashboard);
router.get("/admin/icons", AuthMid.checkAdmin, AdminController.icons);
//members
router.get("/admin/members", AuthMid.checkAdmin, AdminController.index);
router.get("/admin/members/edit/:id", AuthMid.checkAdmin, AdminController.edit);
router.post("/admin/members/update/:id", AuthMid.checkAdmin, AdminController.update);
router.get("/admin/members/del/:id", AuthMid.checkAdmin, AdminController.destroy);
router.get("/admin/members/search", AuthMid.checkAdmin, AdminController.search);
//product
router.get("/admin/products", AuthMid.checkAdmin, ProductController.index);
router.get("/admin/products/create", AuthMid.checkAdmin, ProductController.create);
router.post("/admin/products/store", UploadMid.single("thumbnail"), AuthMid.checkAdmin, ProductController.store);
router.get("/admin/products/edit/:id", AuthMid.checkAdmin, ProductController.edit);
router.post("/admin/products/update/:id", UploadMid.single("thumbnail"), AuthMid.checkAdmin, ProductController.update);
router.get('/admin/products/del/:id', AuthMid.checkAdmin, ProductController.destroy);
router.get('/admin/products/search', ProductController.search);
//category
router.get("/admin/categories", AuthMid.checkAdmin, CategoryController.index);
router.get("/admin/categories/create", AuthMid.checkAdmin, CategoryController.create);
router.post("/admin/categories/store", AuthMid.checkAdmin, CategoryController.store);
router.get("/admin/categories/edit/:id", AuthMid.checkAdmin, CategoryController.edit);
router.post("/admin/categories/update/:id", AuthMid.checkAdmin, CategoryController.update);
router.get('/admin/categories/del/:id', AuthMid.checkAdmin, CategoryController.destroy);
//comment
router.get("/admin/comments", CommentController.index);
router.get("/admin/comments/edit/:id", CommentController.edit);
router.get("/admin/comments/update/:id", CommentController.update);
router.get("/admin/comments/del/:id", CommentController.destroy);
//customer
router.get("/admin/customers", AuthMid.checkAdmin, CustomerController.index);
router.get("/admin/customers/edit/:id", AuthMid.checkAdmin, CustomerController.edit);
router.post("/admin/customers/update/:id", AuthMid.checkAdmin, CustomerController.update);
router.get("/admin/customers/del/:id", AuthMid.checkAdmin, CustomerController.destroy);


//site
router.get("/login", SiteController.getLogin);
router.post("/login", SiteController.postLogin);
router.get("/logout", SiteController.getLogout);
router.get("/register", SiteController.getRegister);
router.post("/register", SiteController.postRegister);
router.get("/", SiteController.home);
router.get("/products", SiteController.product);
router.get("/category-:slug.:id", SiteController.category);
router.get("/productsingle-:slug.:id", SiteController.productSingle);
router.post("/productsingle-:slug.:id", SiteController.comment);
router.get("/about", SiteController.about);
router.get("/blog", SiteController.blog);
router.get("/contact", SiteController.contact);
router.get("/productsingle-:slug.:id/danhgia");
router.get("/search", SiteController.search);
router.get("/cart", SiteController.cart);
router.post("/add-to-cart", SiteController.addToCart);
router.post("/update-cart", SiteController.updateCart);
router.get("/delete-cart-:id", SiteController.deleteCart);
router.get("/checkout", SiteController.checkout);
router.post("/order", SiteController.order);
router.get("/success", SiteController.success);




//api
router.get("/api/admin/products", ApiProduct.index);
router.get("/api/admin/products/create", ApiProduct.create);
router.post("/api/admin/products/store", UploadMid.single("file"), ApiProduct.store);
router.get("/api/admin/products/edit/:id", ApiProduct.edit);
router.get("/api/admin/products/edit/:id", UploadMid.single("file"), ApiProduct.update);
router.post("/api/admin/products/del/:id", ApiProduct.destroy);



module.exports = router;