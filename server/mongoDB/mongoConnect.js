const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  // 1. לשנות את הדאטאבייס שאנחנו מתחברים אליו
  await mongoose.connect('mongodb://127.0.0.1:27017/market');
  console.log("mongo connect market local");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}