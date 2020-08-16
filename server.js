//const http = require('http');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const db = require('./util/database');


const app = express();

//app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views');

// db.execute('SELECT * FROM products')
// .then(result => {
//   console.log(result[0], result[1]);
// })
// .catch(err => {
//   console.log('[db err]', err );
// });

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,  'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// //argument requestListener
// const server = http.createServer(app);
// server.listen(5000);

app.listen(5000);
