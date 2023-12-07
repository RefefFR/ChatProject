const mongoose = require('mongoose');
const Joi = require('joi');


const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }},{
    timestamps: true
  }
);

const chatSchema = new mongoose.Schema({
  id1: {
    type: String,
    required: true
  },
  id2: {
    type: String,
    required: true
  },
  messages: [messageSchema]
});

exports.chatModel = mongoose.model("chats", chatSchema);

exports.validateMessage = (reqBody)=>{
  const joiSchema = Joi.object({
      text: Joi.string().min(1).max(100).required()
  })
  return joiSchema.validate(reqBody);
}

