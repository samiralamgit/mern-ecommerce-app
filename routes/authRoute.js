const express = require('express');
const { registerController, loginController, testController, forgotPasswordController, UpdateProfileController, getOrdersController, getAllOrdersController, orderStatusController } = require('../controllers/authController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');

// router object
const router = express.Router()

// routing
router.post('/register', registerController)
router.post('/login', loginController)
router.post('/forgot-password', forgotPasswordController)

// protected route
router.get('/test', requireSignIn, isAdmin, testController)

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

router.put('/update-profile', requireSignIn, UpdateProfileController)

// get Orders
router.get('/orders', requireSignIn, getOrdersController)

router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);


module.exports = router;