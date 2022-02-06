var express = require("express");
var path = require("path");
const app = express();
const cors = require("cors");
const api = require("./routes/api");

const morgan = require("morgan"); //Per printar resultat pantalla

//Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
  res.render("index", {
    name: "Jaume", //FIXME: passar usuari real
  });
});

app.use("/api", api);

app.get("/login", function (req, res) {
  res.render("login", {});
});

// api.app()

app.listen(5000, () => {
  console.log("Server running port 5000");
});
