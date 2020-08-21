const mongodb = require('mongodb');
const Product = require('../models/product');

exports.getProducts = (req, res,  next) => {
  Product.fetchAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      docTitle: 'Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err));
};

exports.getAddProduct = (req, res,  next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );

  product.save()
    .then(result => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

  };

exports.getEditProduct = (req, res,  next) => {
  const editMode = req.query.edit;
  if(!editMode){
    res.redirect('/');
  }

  const prodId = req.params.productId;

  Product.findById(prodId)
  .then(product => {
    if(!product){
      res.redirect('/');
    }
    res.render('admin/edit-product', {
      docTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err => {
    res.redirect('/');
    console.log(err);
  })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    new mongodb.ObjectId(prodId)
  );
  product
    .save()
    .then(result => {
      console.log('product updated');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteById(prodId)
    .then(() => {
      console.log('product deleted!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
