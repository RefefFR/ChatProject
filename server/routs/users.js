const express = require("express");
const { validateUser, userModel, validateLogin, createToken } = require("../models/userModel");
const bcrypt=require("bcrypt");
const router = express.Router();
const {auth}=require("../midlewares/auth");


// ראוט שמציג משתמשים לפי חיפוש
router.get("/", async(req, res)=>{
  try{
      const limit=req.query.limit || 0;
      const page=req.query.page-1||0;

      let sFind={};
    if (req.query.s){
      const sExp = new RegExp(req.query.s, "i");
      sFind={name: sExp};
    }

    
  const data = await userModel.find(sFind)
  .limit(limit)
  .skip(page*limit)
  res.json(data);
  }catch(err){
      res.json(err);
  }
})
router.get("/showInfo", auth, async(req,res) => {
 
  try{
    const data = await userModel.findOne({_id:req.tokenData._id},{password:0});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/userInfo/:id", async(req,res) => {
 
  try{
    const id = req.params.id;
    const data = await userModel.findOne({_id:id},{password:0});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.post("/signUp", async(req,res) => {
  const validBody = validateUser(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const user = new userModel(req.body);
    user.password = await bcrypt.hash(user.password,10);
    await user.save();
    user.password="*****"
    return res.status(201).json(user);
  }
  catch(err){
    // code 11000 means that the eamail already exists
    if(err.code == 11000){
      return res.status(400).json({err:"Email or user name already in system",code:11000})
    }
    console.log(err);
    res.status(502).json({err})
  }
})

router.post("/login", async(req, res)=>{
  const validBody = validateLogin(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    // here we check if the phone does exist in the database
    const user = await userModel.findOne({phone:req.body.phone})
    if (!user){
      return res.status(401).json({err:"phone is not found"});
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword){
      return res.status(401).json({err:"Password is not correct"});
    }
    const token = createToken(user._id, user.role);
      res.cookie("authToken", token, {
        httpOnly: false,
        expires: new Date(Date.now() + 1000 * 60 * 60),
      }).json(token);
  

  }catch(err){
    console.log(err);
    res.status(502).json(err);
  } 
})

router.put("/SaveContact/:phone/:contactName", auth, async (req, res) => {
  try {

    const phoneQ = req.params.phone;
    const contactName=req.params.contactName;
    const user = await userModel.findOne({_id: req.tokenData._id});
    const contactUser = await userModel.findOne({ phone: phoneQ });
    if (!contactUser) {

      return res.status(404).json({ message: "user not found" });
    }
    const contact = {phone:phoneQ, name: contactName};
    const contactIndex = user.contacts.findIndex(item => item.name === contact.name && item.phone === contact.phone);
    if (contactIndex != -1) {
      user.contacts.splice(contactIndex, 1);
    }
    user.contacts.push(contact);
    const updatedUser = await user.save();
    res.status(201).json(updatedUser);
  } catch (err) {
    res.json(err);
  }
});

router.put("/contactName/:phone", auth, async (req, res) => {
  try {

    const phoneQ = req.params.phone;
    const user = await userModel.findOne({_id: req.tokenData._id});
    const contact = user.contacts.find(item => item.phone === phoneQ);
    if (!contact) {
      return res.json(null);
    }
    res.status(201).json(contact.name);
  } catch (err) {
    res.json(err);
  }
});



module.exports=router;
