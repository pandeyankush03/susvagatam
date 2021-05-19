const express=require('express');
const bodyParser=require('body-parser');
const Partner=require('../model/partner');
const Place=require('../model/place');
const Product=require('../model/product');
const auth=require('../authentication/auth');
const e = require('express');

const partnerRouter=express.Router();
partnerRouter.use(bodyParser.json());

partnerRouter.route('/login')
.post((req,res,next)=>{
   Partner.findOne({email:req.body.email})
   .then((data)=>{
       if(auth.authenticate(req.body.password,data.hash_password))
       {
           res.end(auth.getToken({_id: data._id}));
       }
   })
   .catch((err)=>{
       console.log(err);
   })
});
partnerRouter.route('/register')
.post((req,res,next)=>{
    Partner.findOne({email:req.body.email})
   .then((data)=>{
       if(data)
       {
            res.end('Partner already exist with Email '+req.body.email);
       }
       else
       {
            Partner.findOne({contact:req.body.contact})
            .then((data)=>{
                if(data)
                {
                    res.end('Partner already exist with Contact '+req.body.contact);
                }
                else{
                    Partner.create(req.body)
                    .then((data)=>{
                            res.json({"Message":"Partner Successfully Created."})
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
            })
            .catch((err)=>{
                console.log(err);
            });
       }
   })
   .catch((err)=>{
       console.log(err);
   });
});
partnerRouter.route('/')
.get(auth.verifyPartner,(req,res,next)=>{
    res.json(req.user);
});

partnerRouter.route('/edit')
.put(auth.verifyPartner,(req,res,next)=>{
        if(req.body.password)
        {
            req.body.hash_password=auth.encryptPassword(req.body.password);
        }
        if(req.body.email || req.body.contact)
        {
            Partner.findOne({email:req.body.email})
            .then((data)=>{
                if(data)
                {
                    res.json({"message":"Partenr already exist with email"+req.body.email});
                }
                else{
                    Partner.findOne({contact:req.body.contact})
                    .then((data)=>{
                        if(data)
                        {
                            res.json({"message":"Partenr already exist with contact"+req.body.contact})                            
                        }
                        else{
                            Partner.findByIdAndUpdate(req.user._id,req.body , { new: true })
                            .then((data)=>{
                                res.json(data);
                            })
                            .catch((err)=>{
                                console.log(err);
                            })
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
            })
        }
        else
        {
            Partner.findByIdAndUpdate(req.user._id,req.body , { new: true })
            .then((data)=>{
                res.json(data);
            })
            .catch((err)=>{
                console.log(err);
            })
        }
});


//--------------------------------------------------------------------------------------------
//                                Place
//--------------------------------------------------------------------------------------------

partnerRouter.route('/places')
.get(auth.verifyPartner,(req,res,next)=>{
    // res.json(req.user);
    Place.find({partner_id:req.user._id})
    .then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        console.log(err);
    })
});

partnerRouter.route('/places/add_place')
.post(auth.verifyPartner,(req,res,next)=>{
    req.body.partner_id=req.user._id;
    Place.create(req.body)
    .then((data)=>{
        res.json({"message": "Place successfully add"})
    })
    .catch((err)=>{
        console.log(err);
    })
});

partnerRouter.route('/places/edit/:placeid')
.put(auth.verifyPartner, (req,res,next)=>{
    Place.findOneAndUpdate({partner_id:req.user._id, _id:req.params.placeid},req.body , { new: true })
    .then((data)=>{
        if(data)
        {
            res.end('data updated successfully')
        }
        else{
            res.end("Couldn\'t find place related id"+ req.params.place_id);
        }
        
    })
    .catch((err)=>{
        console.log(err);
    })
});

partnerRouter.route('/places/delete/:placeid')
.delete(auth.verifyPartner, (req,res,next)=>{
    Place.findOneAndDelete({partner_id:req.user._id, _id:req.params.placeid})
    .then((data)=>{
        if(data)
        {
            res.end('place are deleted with id '+req.params.placeid)
        }
        else
        {
            res.end("Couldn\'t find place related id"+ req.params.place_id);
        }
    })
});

partnerRouter.route('/places/delete/all')
.delete(auth.verifyPartner, (req,res,next)=>{
    Place.deleteMany({partner_id:req.user._id})
    .then((data)=>{
        res.end('all places are deleted');
    })
    .catch((err)=>{
        console.log(err);
    })
});

//--------------------------------------------------------------------------------------------
//                                Product
//--------------------------------------------------------------------------------------------

partnerRouter.route('/places/products/list')
.get(auth.verifyPartner,(req,res,next)=>{
    Product.find({partner_id:req.user._id})
    .then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        console.log(err);
    })
})

partnerRouter.route('/places/products/:productid')
.get(auth.verifyPartner,(req,res,next)=>{
    Product.findOne({partner_id:req.user._id,})
    .then((data)=>{
        if(data)
        {
            res.json(data);    
        }
        else
        {
            res.end("Couldn\'t find Product related id"+ req.params.productid);
        }
        
    })
    .catch((err)=>{
        console.log(err);
    })
})

partnerRouter.route('/places/product_by_place/:placeid')
.get(auth.verifyPartner,(req,res,next)=>{
    Product.find({place_id:req.params.placeid, partner_id:req.user._id})
    .then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        console.log(err);
    })
})

partnerRouter.route('/places/products/add_product')
.post(auth.verifyPartner,(req,res,next)=>{
    Place.findById(req.body.place_id)
    .then((data)=>{
        if((data.partner_id.toString()==req.user._id.toString()) && (data.Product_sale==true) && (data.status==true))
        {
            req.body.partner_id=req.user._id.toString();
            Product.create(req.body)
            .then((data)=>{
                res.json({"message": "Product successfully add"})
            })
            .catch((err)=>{
                console.log(err);
            })
        }
        else
        {
            res.end('Permission_denied');
        }
    })
});

partnerRouter.route('/places/products/edit/:productid')
.put(auth.verifyPartner,(req,res,next)=>{
    Product.findOneAndUpdate({partner_id:req.user._id, _id:req.params.productid},req.body,{new:true})
    .then((data)=>{
        if(data)
        {
            res.end("Updated successfully");
        }
        else
        {
            res.end("Couldn\'t find Product related id"+ req.params.productid);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})

partnerRouter.route('/places/products/delete/:productid')
.delete(auth.verifyPartner,(req,res,next)=>{
    Product.findOneAndDelete({partner_id:req.user._id, _id:req.params.productid})
    .then((data)=>{
        if(data)
        {
            res.end('Product Successfully deleted');
        }
        else
        {
            res.end("Couldn\'t find Product related id"+ req.params.productid);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})

partnerRouter.route('/places/products/delete/by_place/:placeid')
.delete(auth.verifyPartner,(req,res,next)=>{
    Product.findOneAndDelete({partner_id:req.user._id, _id:req.params.placeid})
    .then((data)=>{
        if(data)
        {
            res.end('Product Successfully deleted');
        }
        else
        {
            res.end("Couldn\'t find Product related id"+ req.params.productid);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})

partnerRouter.route('/places/products/delete/all')
.delete(auth.verifyPartner,(req,res,next)=>{
    Product.findOneAndDelete({partner_id:req.user._id})
    .then((data)=>{
        if(data)
        {
            res.end('Product Successfully deleted');
        }
        else
        {
            res.end("Couldn\'t find Product related id"+ req.params.productid);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})


module.exports=partnerRouter;