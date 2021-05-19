const express=require('express');
const bodyParser=require('body-parser');
const { request } = require('express');

const homeRouter=express.Router();
homeRouter.use(bodyParser.json());

homeRouter.route('/')
.get((req,res,next)=>{

});
homeRouter.route('/about-us')
.get((req,res,next)=>{

});
homeRouter.route('/contact-us')
.get((req,res,next)=>{

});
homeRouter.route('/career')
.get((req,res,next)=>{

});
homeRouter.route('/login')
.get((req,res,next)=>{

});
homeRouter.route('/register')
.get((req,res,next)=>{

});
homeRouter.route('/search')
.get((req,res,next)=>{
    
});

module.exports=homeRouter;