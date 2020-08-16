const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res,  next) => {
  Product.fetchAll()
  .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
          prods: rows,
          docTitle: 'Shop',
          path: '/products'
      });
    }
  )
  .catch(err => {
    console.log(err);
  });

  // Product.fetchAll(products => {
  //   res.render('shop/product-list', {
  //     prods: products,
  //     docTitle: 'Shop',
  //     path: '/products'});
  // });
}

exports.getProduct = (req, res,  next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
  .then(([product]) => {
    console.log('[product]', product);
      res.render('shop/product-detail', {
        prod: product[0],
        docTitle: product.title,
        path: '/products'
      });
  })
  .catch((err)=> console.log(err));

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
  Product.fetchAll()
  .then(([rows, fieldData]) => {
    res.render('shop/index', {
        prods: rows,
        docTitle: 'Index',
        path: '/'
      });
    }
  )
  .catch(err => {
    console.log(err);
  });
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    console.log('[cart]', cart);
    Product.fetchAll(products => {
      const cartProducts = [];
      console.log('[products]', products);
      for (product of products){
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        console.log('[cartProductData]', cartProductData);
        if(cartProductData){
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      };

      res.render('shop/cart', {
        docTitle: 'Cart',
        path: '/cart',
        products: cartProducts,
        totalPrice: cart.totalPrice
      });
    });
  });

}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
}

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  })

}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    docTitle: 'Checkout',
    path: '/checkout'});
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    docTitle: 'Orders',
    path: '/orders'});
}
