var express = require("express");
var path = require("path");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const api = require("./routes/api");
const dotenv = require("dotenv");


dotenv.config({ path: '/config/config.env' });

//Google Auth2 
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);


const morgan = require("morgan"); //Per printar resultat pantalla

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

app.all("/mapa", (req, res) => {
    res.render("mapa.ejs", {});
});

app.get("/", (req, res) => {
    res.render('index')

});

app.use("/api", api);

app.get("/login", function(req, res) {
    res.render("login", {});
});

app.post("/login", (req, res) => {
    let token = req.body.token;
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub']; //TODO:Save user bbdd
        console.log(payload)

    }
    verify()
        .then(() => {
            res.cookie('session-token', token);
            res.send('success');
        }).
    catch(console.error);



});

app.get('/profile', checkAuthenticated, (req, res) => {
    let user = req.user;
    res.render('profile', { user });
})



app.get('/logout', (req, res) => {
    res.clearCookie('session-token')
    res.redirect('/')
})

const PORT = process.env.PORT

app.listen(process.env.PORT, () => {
    console.log(`Server running port ${PORT}`);
});




function checkAuthenticated(req, res, next) {

    let token = req.cookies['session-token']
    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        })
        const payload = ticket.getPayload()
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
        .then(() => {
            req.user = user;
            next()
        })
        .catch(err => {
            res.redirect('/login')
        })
}