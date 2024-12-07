const mongoose = require('mongoose');
connect().catch(err => console.log(err));

async function connect() {
    await mongoose.connect('mongodb://127.0.0.1:27017/huypro');
    console.log("Kết nối database huypro thành công");
}

module.exports = connect();