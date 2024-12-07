const express = require("express");
const session = require('express-session');
const config = require('config');
const conn = require('../src/common/database');
const bodyParser = require("body-parser");
const app = express();


//config view
app.set("views", config.get("app.view_folder"));
app.set("view engine", "ejs");

//sử dụng để dùng gửi dữ liệu từ From lên post
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(bodyParser.json());
//config static public ta chỉ cần đưa css bootstrap js vào public gỡ đường link /static
app.use("/public", express.static(config.get("app.static_folder")));


//config session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("app.session_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(require('./apps/middlewares/CartMid'));
app.use(require('./apps/middlewares/ShareMid'));




//config router
app.use(require(config.get("app.router")));

module.exports = app;