const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const partnerSchema=mongoose.Schema({
    firstname:
    {
        type:String,
        require: true,
        trim:true,
        min:3,
        max:15
    },
    lastname:
    {
        type:String,
        require: true,
        trim:true,
        min:3,
        max:15
    },
    email:{
        type:String,
        require: true,
        trim:true,
        unique:true,
        lowercase:true
    },
    contact:{
        type:String,
        require: true,
        unique:true
    },
    hash_password:{
        type:String,
        require:true
    },
    profile_picture:
    {
        type:String
    },
    status:
    {
        type:Boolean,
        default:1
    }
},{ timestamps:true });

partnerSchema.virtual('password')
.set(function(password){
    this.hash_password=bcrypt.hashSync(password, 10);
});

module.exports=mongoose.model("Partner",partnerSchema)