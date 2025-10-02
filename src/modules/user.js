const mongoose = require("mongoose")

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

module.exports = mongoose.model("User",userSchema)