const mongoose = require("mongoose")

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://akrwt:Ywm6az7mGE1wdMN0@namastenode.hnpgqlz.mongodb.net/DevTinder")
}

module.exports = connectDB
