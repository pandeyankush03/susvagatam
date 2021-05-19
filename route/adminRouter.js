const express=require('express');
const bodyParser=require('body-parser');
const User=require('../model/user');
const User_detail=require('../model/user_detail');
const Partner=require('../model/partner');
const Place=require('../model/place');
const Product=require('../model/product');
const auth=require('../authentication/auth');


const adminRouter=express.Router();
adminRouter.use(bodyParser.json());

//--------------------------------------------------------------------------------------------
//                                User
//--------------------------------------------------------------------------------------------

adminRouter.route('/users')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        User.find({})
        .then((data)=>{
            res.json(data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/users/:userid')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        User.findById(req.params.userid)
        .then((data)=>{
            res.json(data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})


adminRouter.route('/users/add')
.post(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        User.findOne({email:req.body.email})
        .then((data)=>{
            if(data)
            {
                res.json({"message":"User already Exist with Email"+ req.body.email})
            }
            else
            {
                User.findOne({contact:req.body.contact})
                .then((data)=>{
                    if(data)
                    {
                        res.json({"message":"User already Exist with contact"+ req.body.contact})
                    }
                    else
                    {
                        User.create(req.body)
                        .then((data)=>{
                            res.json({"message":"Users Successfully added"})
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
})


adminRouter.route('/users/edit/:usersid')
.put(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        if(req.body.password)
        {
            req.body.hash_password=auth.encryptPassword(req.body.password);
        }
        if(req.body.email || req.body.contact)
        {
            User.findOne({email:req.body.email})
            .then((data)=>{
                if(data){
                    res.json({"message":"User already Exist with Email"+ req.body.email})
                }
                else{
                    User.findOne({contact:req.body.contact})
                    .then((data)=>{
                        if(data)
                        {
                            res.json({"message":"User already Exist with contact"+ req.body.contact})
                        }
                        else{
                            User.findByIdAndUpdate(req.params.userid,req.body,{new:true})
                            .then((data)=>{
                                res.json({"message":"Users Successfully Updated"})
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
            User.findByIdAndUpdate(req.params.userid,req.body,{new:true})
            .then((data)=>{
                res.json({"message":"Users Successfully Updated"})
            })
            .catch((err)=>{
                console.log(err);
            })
        }
        // else if(req.body.email)
        // {
        //     User.findOne({email:req.body.email})
        //     .then((data)=>{
        //         if(data){
        //             res.json({"message":"User already Exist with Email"+ req.body.email})
        //         }
        //         else{

        //         }
        //     })
        //     .catch((err)=>{
        //         console.log(err);
        //     })

        // }
        // else if(req.body.contact)
        // {
        //     User.findOne({contact:req.body.contact})
        //     .then((data)=>{
        //         if(data)
        //         {
        //             res.json({"message":"User already Exist with contact"+ req.body.contact})
        //         }
        //         else{
        //             ``
        //         }
        //     })
        //     .catch((err)=>{
        //         console.log(err);
        //     })
        // }
        // else
        // {

        // }
    }

})

adminRouter.route('/users/delete/:userid')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        User.findByIdAndRemove(req.params.userid)
        .then((data)=>{
            User_detail.findOneAndDelete({user_id:req.params.userid})
            .then((data)=>{
                res.end('User Deleted')
            })
            .catch((err)=>{
                console.log(err);
            })
            // res.json(data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

})

adminRouter.route('/users/delete/all')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        User.deleteMany({})
        .then((data)=>{
            User_detail.deleteMany({})
            .then((data)=>{
                res.end('User deleted');
            })
            .catch((err)=>{
                console.log(err);
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

//--------------------------------------------------------------------------------------------
//                                User-Details
//--------------------------------------------------------------------------------------------

adminRouter.route('/users/details/')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        User_detail.find({}).populate('user_id')
        .then((data)=>{
            res.json(data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

})

adminRouter.route('/users/details/:userid')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        User_detail.findOne({user_id:req.params.userid}).populate('user_id')
        .then((data)=>{
            res.json(data);
        })
        .catch((err)=>{
            console.log(err);
        })     
    }
})

adminRouter.route('/users/details/add')
.post(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        User_detail.findOne({user_id:req.body.user_id})
        .then((data)=>{
            if(data)
            {
                res.json({"message": "User already Exist with user id"+req.body.user_id})
            }
            else{
                User_detail.create(req.body)
                .then((data)=>{
                    res.json(data)
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

adminRouter.route('/users/details/edit/:userid')
.put(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        User_detail.findOneAndUpdate({user_id:req.params.userid},{$set:req.body}, { new: true })
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})


//--------------------------------------------------------------------------------------------
//                                Partner
//--------------------------------------------------------------------------------------------

adminRouter.route('/partners')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Partner.find({})
        .then((data)=>{
            res.json(data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/:partnerid')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Partner.findById(req.params.partnerid)
        .then((data)=>{
            res.json(data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/add')
.post(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
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
    }
})

adminRouter.route('/partners/edit/:partnerid')
.put(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
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
                    res.json({"message":"partner alredy exist with email"+req.body.email});
                }
                else
                {
                    Partner.findOne({contact:req.body.contact})
                    .then((data)=>{
                        if(data)
                        {
                            res.json({"message":"partner alredy exist with contact"+req.body.contact});
                        }
                        else
                        {
                            Partner.findByIdAndUpdate(req.params.partnerid,req.body,{new:true})
                            .then((data)=>{
                                res.json({"message":"partner are Updated successfully"});
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
            Partner.findByIdAndUpdate(req.params.partnerid,req.body,{new:true})
            .then((data)=>{
                res.json({"message":"partner are Updated successfully"});
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    }
})

adminRouter.route('/partners/delete/:partnerid')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Partner.findByIdAndRemove(req.params.partnerid)
        .then((data)=>{
            Place.deleteMany({partner_id:req.params.partnerid})
            .then((data)=>{
                Product.deleteMany({partner_id:req.params.partnerid})
                .then((data)=>{
                    res.end('partner deleted '+ req.params.partnerid)
                })
                .catch((err)=>{
                    console.log(err);
                })  
            })
            .catch((err)=>{
                console.log(err);
            })
            
        })
        .catch((err)=>{
            console.log(err);
        })
    }

})

adminRouter.route('/partners/delete/all')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Partner.deleteMany({})
        .then((data)=>{
            Place.deleteMany({})
            .then((data)=>{
                Product.deleteMany({})
                .then((data)=>{
                    res.end('all partner are deleted')
                })
            })
            .catch((err)=>{
                console.log(err);
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

//--------------------------------------------------------------------------------------------
//                                Place
//--------------------------------------------------------------------------------------------

adminRouter.route('/partners/places')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Place.find({})
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/:placeid')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Place.findById(req.params.placeid)
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/add')
.post(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Place.create(req.body)
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/edit/:placeid')
.put(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Place.findByIdAndUpdat(req.params.placeid,req.body,{new:true})
        .then((data)=>{
            res.json({"message":"Place Updated successfully"})
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/delete/:placeid')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Place.findByIdAndRemove(req.params.placeid)
        .then((data)=>{
            Product.deleteMany({place_id:req.params.placeid})
            .then((data)=>{
                res.json({"message":"Place deleted successfully"});
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/delete/by_partner/:partnerid')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Place.deleteMany({partner_id:req.params.partnerid})
        .then((data)=>{
            Product.deleteMany({partner_id:req.params.partnerid})
            .then((data)=>{
                res.json({"message":"Place deleted successfully"});
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/delete/all')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Place.deleteMany({})
        .then((data)=>{
            Product.deleteMany({})
            .then((data)=>{
                res.json({"mesaage":"All Place deleted successfully"});
            })
            .catch((err)=>{
                console.log(err);
            })
        })
        .catch((err)=>{
          console.log(err);   
        })
    }
})

//--------------------------------------------------------------------------------------------
//                                Product
//--------------------------------------------------------------------------------------------

adminRouter.route('/partners/places/products')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Product.find({})
        .then((data)=>{
            res.json(data);
        })
        .catch((data)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/products/:productid')
.get(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Product.findById(req.params.productid)
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/products/add')
.post(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Place.findById(req.body.place_id)
        .then((data)=>{
            if(data.Product_sale==true && data.status==true)
            {
                Product.create(req.body)
                .then((data)=>{
                    res.json({"message":"Product added successfuly"})
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

adminRouter.route('/partners/places/products/edit/:productid')
.put(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Product.findByIdAndUpdate(req.params.productid,req.body,{new:true})
        .then((data)=>{
            res.json({"message":"Product Updaate successfully"})
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/products/delete/:productid')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Product.findByIdAndDelete(req.params.productid)
        .then((data)=>{
            res.json({"message":"Product deleted Successfully"})
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/products/by_partener/:partnerid')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Product.deleteMany({partner_id:req.params.partner_id})
        .then((data)=>{
            res.json({"message":"Partner all product deleted Successfully"})
        })  
        .catch((err)=>{
            console.log(err);
        })    
    }
})

adminRouter.route('/partners/places/products/by_place/:placeid')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Product.deleteMany({place_id:req.params.placeid})
        .then((data)=>{
            res.json({"message":"Place all Product deleted Successfully"})
        })      
        .catch((err)=>{
            console.log(err);
        })
    }
})

adminRouter.route('/partners/places/products/all')
.delete(auth.verifyUser,(req,res,next)=>{
    if(req.user.role=='admin')
    {
        Product.deleteMany({})
        .then((data)=>{
            res.json({"message":"all Product deleted Successfully"})
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})