const mongoose=require('mongoose');


const BookScheema= mongoose.Schema({
   title:{
    type: String,
     require: true,
      unique:true },
   excerpt:{
    type: String,
     require: true},
   userId:{
    ref: 'user',
    type: mongoose.Schema.Types.Mixed
   },
   ISBN : {
    type:String, 
    required:true, 
    unique:true
},
   category:{
    type: String, 
    required: true
},
   subcategory: 
   {type: [],
     required:true
    },
   reviews:{
    type:Number, 
    default: 0
},
   isDeleted: {
    type:boolean,
     default: false
    },
   //releasedAt:{timestamp, require: true}

},{timestamp:true});

module.exports= mongoose.model('Book', BookScheema);