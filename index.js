const express = require("express");
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3 // limit each IP to 100 requests per windowMs
});

const app = express();
app.use(morgan('common'))
app.use(helmet())

const whitelist = ['http://localhost:3000', 'http://localhost:3001']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions));

app.use('/api', limiter)

// Port
const port = 3000;

app.get("/", (req, res) => {
    res.json({
        message: "Hello Stranger! How are you?",
    });
});

app.get('/api', (req, res) => {
    res.json({
        message: "This is the API responding..."
    })
})

// Listen
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});