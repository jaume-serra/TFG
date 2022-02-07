var express = require("express");
var path = require("path");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");


//Requests
const morgan = require("morgan"); //Per printar resultat pantalla
const { connect } = require("http2");



//Google Auth2 

//Config file 
dotenv.config({ path: './config/config.env' });




//Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("*/img", express.static(path.join(__dirname, "public/img")));
app.use("*/js", express.static(path.join(__dirname, "public/js")));
app.use("*/css", express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public")));

/* app.get('/react', (req, res) => {
    var html = ReactDOM.renderToString(
        React.createElement(component)
    )
    res.send(html);
})
 */


const whitelist = ["http://localhost:5000"];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccesStatus: 200,
};

app.use(cors(corsOptions));




app.use("/", require("./routes/main"))
app.use("/api", require("./routes/api"));




const PORT = process.env.PORT

app.listen(process.env.PORT, () => {
    console.log(`Server running port ${PORT}`);
});