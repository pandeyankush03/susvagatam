const express=require('express');
const bodyParser=require('body-parser');
const Place=require('../model/place');
const Product=require('../model/product');
// const auth=require('../authentication/auth');
// const permission=require('../authentication/verifypermission')

const placeRouter=express.Router();
placeRouter.use(bodyParser.json());

placeRouter.route('/:placeid')
.get((req,res,next)=>{

    Place.findById(req.params.placeid)
    .then((data1)=>{
        if(data1)
        {
            Product.find({place_id: data1._id})
            .then((data2)=>{
                if(Object.keys(data2).length)
                {
                    res.json({"place":data1, "product":data2})
                }
                else
                {
                    res.json(data1)
                }
            })
            .catch((err)=>{
                console.log(err);
            })
            // res.json(data1)
        }
        else{
            res.end('Could\'nt find Place realate id '+req.params.placeid)
        }
        
    })
    .catch((err)=>{
        console.log(err);
    })
}); 



module.exports=placeRouter;