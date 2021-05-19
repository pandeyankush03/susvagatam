const express=require('express');
const bodyParser=require('body-parser');
const User=require('../model/user');
const User_detail=require('../model/user_detail');
const auth=require('../authentication/auth');

const usersRouter = express.Router();

usersRouter.use(bodyParser.json());

usersRouter.route('/login')
.post((req,res,next) => {
//    User.find({ $or: [{ email: req.body.email }]})
   User.findOne({ email: req.body.email })
   .then((userdata)=>{
        if(userdata)
        {
            if(auth.authenticate(req.body.password,userdata.hash_password))
            {                      
                res.end(auth.getToken({_id: userdata._id}));
            }
            else{
                res.end("Password Missmatch")
            }   
        }
        else
        {
            res.end("Check your email address");
        }
   })
   .catch((err)=>{
       console.log(err);
   })
}); 

usersRouter.route('/register')
.post((req,res,next)=>{
    User.findOne({email: req.body.email})
    .then((data)=>{
            if(data)
            {   
                res.end("User Already Exist with email: "+req.body.email);
            }
            else
            {
            User.findOne({contact: req.body.contact})
            .then((data)=>{
                if(data){
                    res.end("User Already Exist with contact number: "+req.body.contact)
                }
                else
                {
                    if(req.body.password)
                    {
                        req.body.hash_password=auth.encryptPassword(req.body.password);
                    }
                    User.create(req.body)
                    .then((data)=>{
                        res.json({"message": "user Successfully created"});
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                }
            })
        }
    })
    .catch((err)=>{
        console.log(err);
    });
});
usersRouter.route('/')
.get(auth.verifyUser,(req,res,next)=>{
    req.json(req.user);
});

usersRouter.route('/edit')
.put(auth.verifyUser,(req,res,next) => {
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
                        User.findByIdAndUpdate(req.user._id, req.body , { new: true })
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
        .catch((err)=>{
            console.log(err);
        })
    }
    else
    {
        User.findByIdAndUpdate(req.user._id, req.body , { new: true })
        .then((data)=>{
            res.json(data)       
        })
        .catch((err)=>{
            console.log(err);
        })   
}
    
});


usersRouter.route('/detail')
.get(auth.verifyUser,(req,res,next)=>{
    User_detail.find({user_id: req.user._id}).populate('user_id')
    .then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        console.log(err);
    })
})

usersRouter.route('/detail/add_detail')
.post(auth.verifyUser,(req,res,next)=>{
    User_detail.findOne({user_id:req.user._id})
    .then((data)=>{
        if(data)
        {
            res.end('details are submited');
        }
        else
        {
            req.body.user_id=req.user._id;
            User_detail.create(req.body)
            .then((data)=>{
                res.json(data)
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    })
})

usersRouter.route('/detail//edit')
.put(auth.verifyUser,(req,res,next)=>{
    User_detail.findOneAndUpdate({user_id:req.user._id},{$set:req.body}, { new: true })
    .then((data)=>{
        res.json(data)
    })
    .catch((err)=>{
        console.log(err);
    })
})




module.exports= usersRouter;