const express = require('express');
const router = express.Router();
const {chatModel, validateMessage}= require('../models/chatModel'); 
const {auth}=require("../midlewares/auth")
 
router.get('/showChat/:userId', auth, async(req, res)=>{
    try{
        const id1=req.tokenData._id;
        const id2 = req.params.userId;
        const chat = await chatModel.findOne({$or:[{id1, id2}, {id1:id2, id2:id1}]});

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found.' });
        }
   
        if(chat.id1!=id1&&chat.id2!=id1){
            return res.status(401).json({message: "you are not a participant of this chat"})
        }
        res.status(201).json(chat);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})
router.post('/createChat/:id',auth, async (req, res) => {
  try {
    const id1=req.tokenData._id
    const id2 = req.params.id;
    const existingChat = await chatModel.findOne({ $or: [{ id1, id2 }, { id1: id2, id2: id1 }] });

    if (existingChat) {
      return res.status(400).json({ message: 'Chat already exists.' });
    }
    const newChat = new chatModel({ id1, id2 });

    await newChat.save();

    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/sendMessage/:chatId',auth, async (req, res) => {
  try {
    const isValid = validateMessage(req.body);
  if (isValid.error) {
    return res.status(401).json(isValid.error.details);
  }
    const { chatId } = req.params;
    const { text } = req.body;
    const senderId = req.tokenData._id;

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    const id = req.tokenData._id;
    if(chat.id1!=id&&chat.id2!=id){
      return res.status(401).json({message: "you are not a participant of this chat"})
    }
    chat.messages.push({ text, senderId });

    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
