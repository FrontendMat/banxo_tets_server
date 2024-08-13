require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const ErrorMiddleware = require('./middlewares/error-maddleware');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    exposedHeaders: ["Set-Cookie"]
}));

app.set("trust proxy", 1);
app.use('/api', router);
app.use(ErrorMiddleware);

const server = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

server();