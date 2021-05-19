const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema= new mongoose.Schema({
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
    email:
    {
        type:String,
        require: true,
        trim:true,
        unique:true,
        lowercase:true
    },
    contact:
    {
        type:String,
        require: true,
        unique:true
    },
    hash_password:
    {
        type:String,
        require:true
    },
    role:
    {
        type:String,
        enum:['user','admin'],
        default:'user'
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

userSchema.virtual('password')
.set(function(password){
    this.hash_password=bcrypt.hashSync(password, 10);
});

module.exports = mongoose.model('User',userSchema); 