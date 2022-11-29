const { isValidObjectId } = require("mongoose")
const moment=require("moment")
const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const {isValidISBN, isEmpty}=require("../validators/validator")


const createBooks = async function (req, res) {
    try {
      let { title, excerpt, userId,ISBN, category,subcategory } = req.body
      let data = req.body
      if(Object.keys(data).length==0)
         { return res.status(400).send({ status: false, msg: "body is empty" }) }
     data.releasedAt=moment().format()
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
       let data=req.query
       if(!userId && !category && !subcategory){
       let bookdata = await bookModel.find({isDeleted: false }).populate("userId")
           if(!bookdata)
               return res.status(404).send({ status: false, msg: "No Such books Found" })
           return res.status(200).send({ message: "success", data: bookdata })
       }
  
      booksdata = await bookModel.find({data, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 })
      return res.status(200).send({ status: true, message: 'Books list', data: booksdata })

        
     }
    catch(err){
     res.status(500).send({status:false , message: err.message})
   }
 }

 const getbooksParams= async function (req,res){
  try{
    let bookId= req.params.bookId
    if(!bookId)
    return res.status(400).send({status:false, message:"Provide bookid for get the data"})
    if(!isValidObjectId(bookId))
    return res.status(400).send({status:false, message:"Enter valid book id "})
    
    let data= await bookModel.findById({_id:bookId,isDeleted:false})
    if(!data)
    return res.status(404).send({status:false ,message:"No such book found"})

     return res.status(200).send({status:true,message:"success", data: data})
  }
  catch(err){
  return  res.status(500).send({status: false , message:err})
  }
}

 
const updateBook = async function (req, res) {
  try {
      let inputId = req.params.bookId
       
      if (!inputId) return res.status(400).send({ status: false, msg: "book id required" })
      console.log(inputId)
      if(!isValidObjectId(inputId))
       {return res.status(400).send({status:false,message:"invalid bookId"})}
      let details = req.body
      let {title,excerpt,releasedAt,ISBN}= details
      
      if (Object.keys(details).length == 0) {
          return res.status(400).send({ status: false, msg: "Invalid request Please provide details" });
      }
     
      let data = await bookModel.findById(inputId)

      const titleCheck = await bookModel.findOne(title)
      if (titleCheck) {
          return res.status(400).send({ status: false, message: "Can not save the same title." })

      }
      const ISBNCheck = await bookModel.findOne({ ISBN })
      if (ISBNCheck) {
          return res.status(400).send({ status: false, message: "Can not save the same ISBN." })

      }
       let books = await bookModel.findOneAndUpdate({  _id: inputId, isDeleted: false },
          {$set: { title:title,excerpt:excerpt,releasedAt:releasedAt,ISBN:ISBN } },
          { new: true })
    

      if (!books) return res.status(404).send({ status:false,msg: "no book found" })
         return res.status(200).send(books)
  }
  catch (error) {
      return res.status(500).send({ msg: error.message })
  }
}


const deleteBookById = async (req, res) => {
  try {
    let bookId = req.params.bookId
    if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "Enter a valid book Id" })
    let data = await bookModel.findById(bookId)
    if (!data) return res.status(404).send({ status: false, msg: "No such book found" })
    if (data.isDeleted) return res.status(404).send({ status: false, msg: "Data already deleted" })
    let timeStamps = new Date()
    await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: timeStamps })
    res.status(200).send({ status: true, msg: "Deleted" })
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}
  module.exports={createBooks,getbooks,getbooksParams,updateBook,deleteBookById}
