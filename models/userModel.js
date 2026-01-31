const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    age: Number
})

const User = mongoose.model("User", userSchema)
module.exports = User