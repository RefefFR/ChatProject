const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  password:String,
  phone: String,
  img_url: String,
  contacts :Array,
  date_created:{
    type:Date, default:Date.now
  }
})
exports.userModel = mongoose.model("users",userSchema);

exports.createToken = (_id) => { 
  const token = jwt.sign({_id},"maxim", {expiresIn:"6000mins"})
  return token;
}

exports.validateUser = (_reqBody) => {
  const joiSchema = Joi.object({
    phone:Joi.string().min(8).max(15).required(),
    password:Joi.string().min(3).max(16).required()
  })
  return joiSchema.validate(_reqBody)
}

exports.validateLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    phone:Joi.string().min(8).max(15).required(),
    password:Joi.string().min(3).max(16).required()
  })
  return joiSchema.validate(_reqBody)
}