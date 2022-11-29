const { isValidObjectId } = require("mongoose")
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const {isValidISBN, isEmpty}=require("../validators/validator")


const createBooks = async function (req, res) {
    try {
      let { title, excerpt, userId,ISBN, category,subcategory } = req.body
      let data = req.bodya
      if(Object.keys(data).length==0)
         { return res.status(400).send({ status: false, msg: "body is empty" }) }
      if (!title) 
         { return res.status(400).send({ status: false, msg: "title is mandatory" }) }
      if (!excerpt) 
         { return res.status(400).send({ status: false, msg: "excerpt is mandatory" }) }
      if (!userId) 
         { return res.status(400).send({ status: false, msg: "authorld is mandatory" }) }
      if(!ISBN)
         {return res.status(400).send({status:false,msg:"ISBN is mandatory"})}
      if (!category) 
         { return res.status(400).send({ status: false, msg: "category is mandatory" }) }
      if(!subcategory)
         {return res.status(400).send({status:false,msg:"subcategory is mandatory"})}  
    
      if (!isValidObjectId(userId)) 
         { return res.status(400).send({ status: false, msg: "user id is not valid" }) }
      
      if(!isValidISBN(ISBN))
         { return res.status(400).send({ status: false, msg: "ISBN number is not valid" }) }
      let sendbody = req.body
      let bodydata = Object.keys(sendbody)
      if (bodydata.length == 0) {
         return res.status(400).send({ status: false, msg: "body is empty" }) }
  
      if (!title) { 
        return res.status(400).send({ status: false, msg: "title is mandatory" }) 
      }
      if(!isEmpty(title)) 
      return res.status(400).send({ status: false, msg: "title cannot be empty "}) 
      if (!excerpt) { 
        return res.status(400).send({ status: false, msg: "excerpt is mandatory" })
       }
       if(!isEmpty(excerpt)) 
      return res.status(400).send({ status: false, msg: "excerpt cannot be empty "}) 
      
      if (!userId) { 
        return res.status(400).send({ status: false, msg: "userId is mandatory" }) 
      }
      if(!isEmpty(userId)) 
      return res.status(400).send({ status: false, msg: "userId cannot be empty "}) 
      
      if(!ISBN){
        return res.status(400).send({status:false,msg:"ISBN is mandatory"})
      }
      if(!isEmpty(ISBN)) 
      return res.status(400).send({ status: false, msg: "ISBN cannot be empty "}) 
      
      if (!category) { 
        return res.status(400).send({ status: false, msg: "category is mandatory" }) 
      }
      if(!isEmpty(category)) 
      return res.status(400).send({ status: false, msg: "category cannot be empty "}) 
      
      if(!subcategory){
        return res.status(400).send({status:false,msg:"subcategory is mandatory"})
      }  
      if(!isEmpty(subcategory)) 
      return res.status(400).send({ status: false, msg: "subcategory cannot be empty "}) 
      
      if (!isValidObjectId(userId)) { 
        return res.status(400).send({ status: false, msg: "user id is not valid" })
       }
      
      if(!isValidISBN(ISBN)){ 
        return res.status(400).send({ status: false, msg: "ISBN number is not valid" }) 
      }
      let duplititle =await bookModel.findOne({title:title})
        if(duplititle){
          return res.status(400).send({status:false , message:"title already available"})}
        let dupliISBN=await bookModel.findOne({ISBN:ISBN})
        if(dupliISBN){
        return res.status(400).send({status:false,message:"ISBN already registered"})}

      let usercheck = await userModel.findById(userId)
      if (!usercheck) { return res.status(404).send({ status: false, msg: "user id is not found in db" }) }
  
      let bookCreated = await bookModel.create(req.body)
      res.status(201).send({satus:true,message:"Success" ,data: bookCreated })
    }
    catch (error) {
      res.status(500).send({ status: false, msg: error.message })
    }
  }



  const getbooks= async function(req,res){
   try{
       let {userId ,category ,subcategory } = req.query 
       if(!userId && !category && !subcategory){
       let bookdata = await bookModel.find({isDeleted: false }).populate("userId")
           if(!bookdata)
               return res.status(404).send({ status: false, msg: "No Such books Found" })
           return res.status(200).send({ message: "success", data: bookdata })
       }
   let getdata= await bookModel.find({$or:[{userId:userId },{category: category },{subcategory:subcategory }]}).select({_id:1, title:1, userId:1 ,category:1, excerpt:1, reviews:1, releasedAt:1,}).sort({title:1})
        let data= getdata.filter(a => a.isDeleted ==false)
        if(!data)
        return res.status(400).send({status: false , message:"no such book found"})

        res.status(200).send({status:false,message:"Booklist", data })
     }
    catch(err){
     res.status(500).send({status:false , message: err.message})
   }
 }



  module.exports={createBooks , getbooks}
