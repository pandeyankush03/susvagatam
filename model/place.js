const mongoose=require('mongoose')

const placeSchema=mongoose.Schema({
    partner_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'
    },
    title:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        min:3,
        max:15
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
    category:{
        type:String,
        require: true,
        lowercase:true
    },
    sub_category:{
        type:String,
        require: true,
        lowercase:true
    },
    description:{
        type:String,
        require: true
    },
    address:{
        type:String,
        require: true,
        lowercase:true
    },
    nearest_railway_station:{
        type:String,
        require: true,
        lowercase:true
    },
    nearest_airport:{
        type:String,
        require: true,
        lowercase:true
    },
    image:{
        type:String,
        require: true,
    },
    Product_sale:{
        type:Boolean,
        default:0
    },
    status:{
        type:Boolean,
        default:0
    }

},{timestamps:true})

module.exports=mongoose.model('Place',placeSchema);