const adminModel = require("../../models/admin");
const productModel = require("../../models/product");
const categoryModel = require("../../models/category");
const commentModel = require("../../models/comment");
const pagnigation = require("../../../common/pagnigation");

const dashboard = async (req, res) => {
  const adminCount = await adminModel.find().countDocuments();
  const productCount = await productModel.find().countDocuments();
  const categoryCount = await categoryModel.find().countDocuments();
  const commentCount = await commentModel.find().countDocuments();
  res.render("admin/dashboard", {
    adminCount,
    productCount,
    categoryCount,
    commentCount,
  });
};

const icons = (req, res) => {
  res.render("admin/icons");
};

const index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  //bo qua bao nhieu du lieu
  const skip = page * limit - limit;
  //xem có bao nhieu du lieu
  const totalRow = await adminModel.find().countDocuments();
  //tong co bao nhieu trang
  const totalPage = Math.ceil(totalRow / limit);
  //tro ve truoc
  const prev = page - 1;
  //check de co tro ve truoc duoc khong
  const hasPrev = page > 1 ? true : false;
  //tro ve sau
  const next = page + 1;
  //check de tro ve sau duoc k
  const hasNext = page < totalPage ? true : false;
  const members = await adminModel
    .find()
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip);
  res.render("admin/members/index", {
    members,
    pages: pagnigation(page, totalPage),
    next,
    hasNext,
    prev,
    hasPrev,
  });
};

const edit = async (req, res) => {
  const id = req.params.id;
  const member = await adminModel.findById(id);
  res.render("admin/members/edit", { member });
};
const update = async (req, res) => {
  const id = req.params.id;
  const { fullname, email, phone, role } = req.body;
  const member = {
    fullname,
    email,
    phone,
    role,
  };
  await adminModel.findByIdAndUpdate(id, member);
  res.redirect("/admin/members");
};
const destroy = async (req, res) => {
  const id = req.params.id;
  await adminModel.findByIdAndDelete(id);
  res.redirect("/admin/members");
};
const search = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = page * limit - limit;
  const keyword = req.query.keyword;
  const members = await adminModel
    .find({
      $or: [
        { fullname: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ],
    })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  const totalRow = members.length;
  const totalPage = Math.ceil(totalRow / limit);
  const prev = page - 1;
  const hasPrev = page > 1 ? true : false;
  const next = page + 1;
  const hasNext = page < totalPage ? true : false;
  res.render("admin/members/search", {
    members,
    pages: pagnigation(page, totalPage),
    next,
    hasNext,
    prev,
    hasPrev,
    keyword,
  });
};

module.exports = {
  dashboard,
  icons,
  index,
  edit,
  update,
  destroy,
  search,
};
