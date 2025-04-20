const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

const AuthRouter = require('./routes/auth');
const UrlRouter = require('./routes/url');
const RedirectUrl = require('./routes/url/RedirectUrl.js');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({
        status: 500,
        error: "internal-server-error",
        message: "Something went wrong!",
    });
});

app.get('/', (req, res) => res.redirect(302, process.env.FRONTEND_REDIRECT_URL));
app.get('/:slug', RedirectUrl);
app.use('/api/user/auth', AuthRouter);
app.use('/api/user/url', UrlRouter);

mongoose.connect(process.env.DB_URL)
    .then(() => { 
        app.listen(process.env.PORT);
    })
    .catch((err) => {
        console.error("Could not connect to the database", err);
        process.exit(1);
    });