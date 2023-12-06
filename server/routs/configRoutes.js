
const usersR=require("./users");
const cookieR=require("./cookies");
const uploadR=require("./upload");



exports.routsInit=(app)=>{
    app.use("/users", usersR);
    app.use("/cookies", cookieR);
    app.use("/upload", uploadR);

}


