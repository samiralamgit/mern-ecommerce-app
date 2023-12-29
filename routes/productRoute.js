const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFilterController, productCountController, productListController, searchProductController, relatedProductController, braintreeTokenController, braintreePaymentsController } = require('../controllers/productController');
const ExpressFormidable = require('express-formidable');
const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, ExpressFormidable(), createProductController)

router.put('/update-product/:pid', requireSignIn, isAdmin, ExpressFormidable(), updateProductController)

router.get('/get-product', getProductController)

router.get('/get-product/:slug', getSingleProductController)

router.get('/product-photo/:pid', productPhotoController)

router.delete('/delete-product/:pid', deleteProductController)

router.post('/product-filters', productFilterController)

router.get('/product-count', productCountController)

router.get('/product-list/:page', productListController)

router.get('/product-search/:keyword', searchProductController)

router.get('/related-product/:pid/:cid', relatedProductController)

// payment
// tocken
router.get('/braintree/token', braintreeTokenController);

router.post('/braintree/payment', requireSignIn, braintreePaymentsController);

module.exports = router;