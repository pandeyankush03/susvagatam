const express=require('express');
const bodyParser=require('body-parser');
const Product=require('../model/product');


const productRouter=express.Router();
productRouter.use(bodyParser.json());

productRouter.route('/:productid')
.get((req,res,next)=>{
    Product.findById(req.params.productid)
    .then((data)=>{
        if(data)
        {
            res.json(data);
        }
    })
    res.end('specific product details'+req.params.productid)
});



module.exports=productRouter;