//const http = require('http');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
//const db = require('./util/database');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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

app.use((req, res, next) => {
  User.findByPk(1)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// //argument requestListener
// const server = http.createServer(app);
// server.listen(5000);

//create relations (product belongs to a user)
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//create tables and relations in database
sequelize
  //.sync({force: true})
  .sync()
  .then(result => {
    return User.findByPk(1);
  }).then(user => {
    if(!user){
      return User.create({
        name: 'Max',
        email: 'test@test.com'
      });
    }
    return Promise.resolve(user);
  })
  .then(user => {
    //console.log(user);
    return user.createCart();
  })
  .then(cart => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
