const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String
    },
    password : {
       type : String 
    },
    gender : {
        type : String
    },
    age : {
        type : Number
    },
    skills : {
        type : [String]
    },
    photoURL : {
        type : String
    },
    about : {
        type : String
    }
},{timestamps : true})



userSchema.methods.getJWT = async function () {
    const user = this
     const token = jwt.sign({ _id: user._id }, "DEV@Tinder790");
     return token;
}

userSchema.methods.validatePassword = async function (passwordEnteredByUser) {
    const user = this
    const passwordHash = user.password
    const IsUserCorrect = await bcrypt.compare(passwordEnteredByUser,passwordHash);
    return IsUserCorrect
}

module.exports = mongoose.model("User",userSchema)