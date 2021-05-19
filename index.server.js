const express= require('express');
const http= require('http');
const mongoose=require('mongoose');
// const passport=require('passport');
var Passport = require('passport').Passport,
    passport = new Passport(),
    partnerPassport = new Passport();

const app= express();

app.use(passport.initialize());
app.use(partnerPassport.initialize());

const hostname = 'localhost';
const port = 2000;
const url="mongodb://localhost:27017"

mongoose.connect(
    'mongodb://localhost:27017/susvagatam', 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify:false
    }
).then(()=>{
    console.log('database connected');
});




const homeRouter = require('./route/homeRouter.js');
const partnerRouter = require('./route/partnerRouter.js');
const placeRouter = require('./route/placeRouter.js');
const productRouter = require('./route/productRouter.js');
const usersRouter = require('./route/usersRouter.js');

app.use('/', homeRouter);
app.use('/partners', partnerRouter);
app.use('/places',placeRouter);
app.use('/partners/product', productRouter);
app.use('/users', usersRouter);


const server= http.createServer(app)
server.listen(port,hostname,()=>{
    console.log('server is runing')
});