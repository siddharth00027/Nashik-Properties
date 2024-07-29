const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
    },
    description: {
        type : String,
    },
    image:{
        url: String,
        filename: String,
    },
    price:{
        type:Number,
    },
    property_type:{
        type:String,
    },
    location:{
        type:String,
    },
    project_by:{
        // type:Schema.Types.ObjectId,
        // ref:"Developer",
        type:String,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    designed_by: String,
    legal_adviser:String,
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            //required: true
        },
        coordinates: {
            type: [Number],
           // required: true
        }
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;