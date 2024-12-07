const adminModel = require("../../models/admin");
const bcrypt = require("bcrypt");
const getLogin = (req, res) => {
  res.render("admin/login", { data: {} });
};
const postLogin = async (req, res) => {
  let { account, password } = req.body;
  const checkAdmin = await adminModel.findOne({
    account: account,
  });
  if (checkAdmin) {
    bcrypt.compare(password, checkAdmin.password, function (err, result) {
      if (result) {
        req.session.accountAdmin = account;
        res.redirect("/admin/dashboard");
      } else {
        error = "Tài khoản hoặc mật khẩu không chính xác";
        res.render("admin/login", { data: { error } });
      }
    });
  } else {
    res.render("admin/login", {
      data: { error: "Tài khoản chưa được đăng ký" },
    });
  }
};

const getLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
};

const getRegister = (req, res) => {
  res.render("admin/register", { data: {} });
};
const postRegister = async (req, res) => {
  const { account, password, email, fullname, phone } = req.body;
  const saltRounds = 10;
  let encryptedPassword = "";
  const checkAdmin = await adminModel.find({
    $or: [{ account: account }, { email: email }],
  });

  if (checkAdmin.length > 0) {
    res.render("admin/register", {
      data: { error: "Tài khoản đã được đăng ký!" },
    });
  } else {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, async function (err, hash) {
        encryptedPassword = hash;
        const admin = {
          account,
          password: encryptedPassword,
          email,
          fullname,
          phone,
        };
        req.session.accountAdmin = account;
        new adminModel(admin).save();
        res.redirect("/admin/dashboard");
      });
    });
  }
};
module.exports = {
  getLogin,
  postLogin,
  getLogout,
  getRegister,
  postRegister,
};
