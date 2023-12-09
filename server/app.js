// ייבוא של האקספרס
const express= require("express");

const cors = require("cors");

// ספריה שיודעת להפעיל שרת
const http = require("http");
// מאפשר לעשות מניפולציות על כתובות כמו למשל לבדוק אם הקובץ פבליק או לקחת סיומת
const path = require("path");

// שם את כל הראוטרים
const {routsInit}= require("./routs/configRoutes"); 

const cookieParser = require('cookie-parser');

require("./mongoDB/mongoConnect");

// app -> מייצג את כל התוספות ויכולות של שנרצה להכניס לאקספרס 
const app = express();

// כדי שנוכל לקבל באדי בבקשות פוסט פוט ודליט
app.use(express.json());
app.use(cookieParser());


// middleware - פונקציית אמצע
// דואג שהקבצים שנמצאים בתקיית פאבליק יהיו חשופים
// לצד לקוח
app.use(express.static(path.join(__dirname,"public")));

app.use(cors({
    origin: true,
    credentials: true
}));
routsInit(app);



//  הגדרה ראשונית של הסרבר
const server = http.createServer(app);



// בודק באיזה פורט להריץ את השרת, אם בשרת אמיתי אוסף את המשתנה פורט 
// מסביבת העבודה שלו ואם לא אז מהפורט 3001

const port = process.env.PORT||3002;
server.listen(port);