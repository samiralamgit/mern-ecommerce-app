const { hashPassword, comparePassword } = require('../helpers/authHelper')
const orderModel = require('../models/orderModel')
const userModel = require('../models/userModel')
const JWT = require('jsonwebtoken')

const registerController = async (req, res) => {
    try {
        const { name, email, gender, phone, address, password } = req.body
        // validation
        if (!name) {
            return res.send({ message: 'name is required' })
        }
        if (!email) {
            return res.send({ message: 'email is required' })
        }
        if (!gender) {
            return res.send({ message: 'gender is required' })
        }
        if (!phone) {
            return res.send({ message: 'phone no is required' })
        }
        if (!address) {
            return res.send({ message: 'address is required' })
        }
        if (!password) {
            return res.send({ message: 'password is required' })
        }

        // check user
        const exisitingUser = await userModel.findOne({ email })
        // existing user
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: 'Email is existing',
            })
        }

        // register user
        const hashedPassword = await hashPassword(password)
        // save
        const user = await new userModel({ name, email, gender, phone, address, password: hashedPassword }).save()

        res.status(201).send({
            success: true,
            message: 'user register successfully',
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        })
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or Password"
            })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not register'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }
        // Token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).send({
            success: true,
            message: 'login successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                gender: user.gender,
                role: user.role
            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

const forgotPasswordController = async (req, res) => {
    try {
        const { email, phone, newPassword } = req.body
        if (!email) {
            res.status(400).send({
                message: "Email is required"
            })
        }
        if (!phone) {
            res.status(400).send({
                message: "phone no is required"
            })
        }
        if (!newPassword) {
            res.status(400).send({
                message: "New Password is required"
            })
        }
        // check
        const user = await userModel.findOne({ email, phone })
        // validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong email or Phone Number'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: 'Password reset successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error
        })
    }
}

const testController = (req, res) => {
    res.send('Protected route')
}

const UpdateProfileController = async (req, res) => {
    try {
        const { name, email, gender, phone, address } = req.body;
        const user = await userModel.findById(req.user._id);
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            email: email || user.email,
            phone: phone || user.phone,
            gender: gender || user.gender,
            address: address || user.address,
        }, { new: true })
        res.status(200).send({
            success: true,
            message: 'Profile Update successfully',
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error
        })
    }
}

const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
        // .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updating Orders",
            error,
        });
    }
}

module.exports = {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    UpdateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController
}