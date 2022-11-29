const reviewModel = require("../models/reviewModel")

const getreview = async function(req,res){
    try{
       let data= req.body
       let datacreated = await reviewModel.create(data)
       res.status(201).send({status:false, message:"success", datacreated})
    }
    catch(err){
    res.status(500).send()
}
}

module.exports.getreview=getreview