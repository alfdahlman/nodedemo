const Product = require('../models/product');

exports.getAddProduct = (req, res,  next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.getEditProduct = (req, res,  next) => {
  const editMode = req.query.edit;
  if(!editMode){
    res.redirect('/');
  }

  const prodId = req.params.productId;

  req.user.getProducts({where: {id: prodId}})
  //Product.findByPk(prodId)
  .then(products => {
    const product = products[0];
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
  // Product.findById(prodId, product => {
  //   console.log(product);
  //   if(!product){
  //     res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     docTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // });


};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  //createProduct-function created by sequelize base on model Product name, user hasMany Products (in aerver.js) >>>>>>>>>User.hasMany(Product); Adds relationship
  req.user.createProduct({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price
  })
  .then(result => {
    console.log(result);
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));

  // Product.create({
  //   title: title,
  //   description: description,
  //   imageUrl: imageUrl,
  //   price: price,
  //   userId: req.user.id
  // })
  // .then(result => {
  //   console.log(result);
  //   res.redirect('/admin/products');
  // })
  // .catch(err => console.log(err));

  // const product = new Product(null, title, imageUrl, price, description);
  // product.save()
  // .then(() => {
  //   res.redirect('/');
  // })
  // .catch(err => console.log(err) );
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.findByPk(prodId)
  .then(product => {
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    //.save() update item in db (if exists)
    return product.save();
  })
  .then(result => {
    console.log('update product!');
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));


  // const product = new Product(prodId, title, imageUrl, price, description);
  // product.save();

};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(() => {
      console.log('product deleted!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  //Product.deleteById(prodId);

};

exports.getProducts = (req, res,  next) => {
  req.user.getProducts()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      docTitle: 'Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err));
  
  // Product.findAll().then(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     docTitle: 'Products',
  //     path: '/admin/products'
  //   });
  // }).catch(err => console.log(err));

  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     docTitle: 'Products',
  //     path: '/admin/products'
  //   });
  // });
};
