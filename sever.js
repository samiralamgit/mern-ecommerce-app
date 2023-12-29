const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const authRoutes = require('./routes/authRoute')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoute')
const cors = require('cors')
const path = require('path');

// Configure
dotenv.config()

// database connection
connectDB();

// rest object
const app = express()

// middelware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, './client/build')))

// routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoutes)

// rest api
app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`.bgCyan.white)
})