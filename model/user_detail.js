const mongoose=require('mongoose');

const users_detailSchema=mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gender:{
        type:String,
        require: true,
        enum:['male','female'],
        lowercase:true
    },
    city:{
        type:String,
        require: true,
        lowercase:true
    },
    state:{
        type:String,
        require: true,
        lowercase:true
    },
    country:{
        type:String,
        require: true,
        lowercase:true
    },
    pincode:{
        type:String,
        require: true
    },
    purpose_of_travel:{
        type:String,
        require: true,
        lowercase:true
    }
},{ timestamps:true });

module.exports = mongoose.model('users_detail',users_detailSchema); 