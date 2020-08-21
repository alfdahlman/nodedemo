const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
    this.userId = userId;
  }

  save(){
    const db = getDb();
    let dbOperation;

    if(this._id){
      dbOperation = db
        .collection('products')
        .updateOne(
          { _id: new mongodb.ObjectId(this._id)},
          { $set: this }
        )
    }else{
      dbOperation = db
        .collection('products')
        .insertOne(this)
    }

    return dbOperation
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err));
  }

  static fetchAll(){
    const db = getDb();
    //find returns cursor, toArray returns promise
    return db
    .collection('products')
    .find()
    .toArray()
    .then(products => {
      console.log('[fetchAll]', products);
      return products;
    })
    .catch(err => console.log(err));
  }

  static findById(prodId){
    const db = getDb();
    return db
    .collection('products')
    .find({
      _id: new mongodb.ObjectId(prodId)
    })
    .next()
    .then(product => {
      console.log('[findById]', product);
      return product;
    })
    .catch(err => console.log(err));
  }

  static deleteById(prodId){
    const db = getDb();
    return db
    .collection('products')
    .deleteOne({
      _id: new mongodb.ObjectId(prodId)
    })
    .then(result => {
      console.log('DELETED');
    })
    .catch(err => console.log(err));
  }
}

module.exports = Product;
