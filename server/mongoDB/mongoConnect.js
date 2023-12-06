const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  // 1. לשנות את הדאטאבייס שאנחנו מתחברים אליו
  await mongoose.connect('mongodb://127.0.0.1:27017/chat');
  console.log("mongo connect chat local");


}