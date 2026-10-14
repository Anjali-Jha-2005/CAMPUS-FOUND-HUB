const express = require('express');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

app.use(express.json());

app.get('/test', (req, res, next) => {
    try {
        console.log('Testing assignment to req.query...');
        req.query = { ...req.query };
        console.log('Assignment successful');
    } catch (err) {
        console.log('Assignment failed:', err.message);
    }
    next();
});

app.use(mongoSanitize());
app.use(hpp());

app.get('/', (req, res) => res.send('OK'));

app.listen(5001, () => {
    console.log('Reproduction server running on port 5001');
});
