const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//arg 1 model name
//arg 2 structure  of  model
const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price:  {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;

// const db = require('../util/database');
//
// const Cart = require('./cart');
//
// module.exports = class Product {
//   constructor(id, title, imageUrl, price, description){
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }
//
//   save(){
//     return db.execute(
//       'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
//       [this.title, this.price, this.imageUrl, this.description]
//     );
//   }
//
//   static deleteById(id){
//   }
//
//   //static call keyword on class itself, not extentiated object
//   static fetchAll(){
//     return db.execute('SELECT * FROM products');
//   }
//
//   static findById(id){
//     return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
//   }
//
// }
