var express = require('express');
var path = require('path')
const app = express();


const api = require('./routes/api');



const morgan = require('morgan');//Per printar resultat pantalla
//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use('*/img', express.static(path.join(__dirname, 'static/img')));
app.use('*/js', express.static(path.join(__dirname, 'static/js')));
app.use('*/css', express.static(path.join(__dirname, 'static/css')));




app.get('/llistat',(req,res) =>{
    res.render('mapa',{});
});

app.get('/', (req, res) => {
    res.render('index', {
        name: "Jaume"
    });
});

app.use('/api',api);  // Use api.js to handle js

/* app.get('/llistat',function(req,res){
    res.render('mapa',{});
});
*/


/* app.get('/login', function (req, res) {
    res.render('login', {});
});
 */

// api.app()

app.listen(3000);