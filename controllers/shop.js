const Product = require('../models/product');

exports.getProducts = (req, res,  next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
        prods: products,
        docTitle: 'Index',
        path: '/products'
      });
  }).catch(err => console.log(err));

  // Product.fetchAll()
  // .then(([rows, fieldData]) => {
  //     res.render('shop/product-list', {
  //         prods: rows,
  //         docTitle: 'Shop',
  //         path: '/products'
  //     });
  //   }
  // )
  // .catch(err => {
  //   console.log(err);
  // });

  // Product.fetchAll(products => {
  //   res.render('shop/product-list', {
  //     prods: products,
  //     docTitle: 'Shop',
  //     path: '/products'});
  // });
}

exports.getProduct = (req, res,  next) => {
  const prodId = req.params.productId;

  Product.findAll({ where:{ id: prodId }})
  .then((products) => {
    console.log('[]', products);
    res.render('shop/product-detail', {
      prod: products[0],
      docTitle: products[0].title,
      path: '/products'
    });
  })
  .catch((err)=> console.log(err));

  // ====ALT SYNTAX=====
  // Product.findByPk(prodId)
  // .then((product) => {
  //   res.render('shop/product-detail', {
  //     prod: product,
  //     docTitle: product.title,
  //     path: '/products'
  //   });
  // })
  // .catch((err)=> console.log(err));

  // Product.findById(prodId)
  // .then(([product]) => {
  //   console.log('[product]', product);
  //     res.render('shop/product-detail', {
  //       prod: product[0],
  //       docTitle: product.title,
  //       path: '/products'
  //     });
  // })
  // .catch((err)=> console.log(err));

  // Product.findById(prodId, product => {
  //   console.log('[product]:', product);
  //   res.render('shop/product-detail', {
  //     prod: product,
  //     docTitle: product.title,
  //     path: '/products'
  //   });
  // });
}

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/index', {
        prods: products,
        docTitle: 'Index',
        path: '/'
      });
  }).catch(err => console.log(err));

  // Product.fetchAll()
  // .then(([rows, fieldData]) => {
  //   res.render('shop/index', {
  //       prods: rows,
  //       docTitle: 'Index',
  //       path: '/'
  //     });
  //   }
  // )
  // .catch(err => {
  //   console.log(err);
  // });
}

exports.getCart = (req, res, next) => {

  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            docTitle: 'Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

    // Cart.getCart(cart => {
    //   console.log('[cart]', cart);
    //   Product.fetchAll(products => {
    //     const cartProducts = [];
    //     console.log('[products]', products);
    //     for (product of products){
    //       const cartProductData = cart.products.find(prod => prod.id === product.id);
    //       console.log('[cartProductData]', cartProductData);
    //       if(cartProductData){
    //         cartProducts.push({ productData: product, qty: cartProductData.qty });
    //       }
    //     };
    //
    //     res.render('shop/cart', {
    //       docTitle: 'Cart',
    //       path: '/cart',
    //       products: cartProducts,
    //       totalPrice: cart.totalPrice
    //     });
    //   });
    // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log('[postCart]', err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err))

  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // })

};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/cart'});
};

exports.postOrders = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      console.log('[products]', products);
      return req.user.createOrder()
      .then(order => {
        order.addProducts(products.map(product => {
          product.orderItem = {
            quantity: product.cartItem.quantity
          };
          return product;
        }))
      })
      .then(result => {
        fetchedCart.setProducts(null);
      })
      .then(result => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        docTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
