var express = require('express')
var path = require('path')
const app = express()
/* const ReactDOM = require('react-dom');
const React = require('react'); */


const api = require('./routes/api')



const morgan = require('morgan')//Per printar resultat pantalla


/* Inici react */






//Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))

app.use('*/img', express.static(path.join(__dirname, 'public/img')))
app.use('*/js', express.static(path.join(__dirname, 'public/js')))
app.use('*/css', express.static(path.join(__dirname, 'public/css')))
app.use(express.static(path.join(__dirname, 'public')))


/* app.get('/react', (req, res) => {
    var html = ReactDOM.renderToString(
        React.createElement(component)
    )
    res.send(html);
})
 */
app.all('/mapa', (req, res) => { //Todo: not working
    res.render('mapa.ejs', {})
})

app.get('/', (req, res) => {
    res.render('index', {
        name: "Jaume"
    })
})


app.use('/api', api)  // Use api.js to handle js

/* app.get('/llistat',function(req,res){
    res.render('mapa',{});
});
*/


/* app.get('/login', function (req, res) {
    res.render('login', {});
});
 */

// api.app()

app.listen(5000, () => {
    console.log("Server running port 5000")
});