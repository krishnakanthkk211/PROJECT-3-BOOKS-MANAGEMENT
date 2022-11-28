const mongoose=require('mongoose');

const reviewScheema= mongoose.Schema({
    bookId:{
        type: mongoose.Schema.Types.Mixed, 
        required: true, 
        ref:'Book'
    },
    reviewedBy: { 
        type:String, required:true, 
        default:'guest'},
    rating:{
        type: Number,
         required: true
        },
     review:String


}, {timestamp:true})

module.exports= mongoose.model('review', reviewScheema)