require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const ErrorMiddleware = require('./middlewares/error-maddleware');

const app = express()
const PORT = process.env.PORT || 7000

app.use(express.json())
app.use(cookieParser())

app.use('/api', cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
        exposedHeaders: ["Set-Cookie"]
    }
))

app.set("trust proxy", 1);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use('/api', router)
app.use(ErrorMiddleware)

const server = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => console.log(PORT))
    } catch (e) {
        console.log(e)
    }
}

server()
