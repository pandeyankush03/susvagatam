const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    place_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Place'
    },
    partner_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Partner'
    },
    title:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        min:3,
        max:30
    },
    about:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        min:3,
        max:50
    },
    description:{
        type:String,
        require:true
    },
    condition:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require: true,
    },
    actual_cost:{
        type:String,
        require:true
    },
    discount_cost:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:0
    }

},{timestamps:true})

module.exports=mongoose.model('Product',productSchema);