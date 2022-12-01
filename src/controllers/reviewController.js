const reviewModel = require('../models/reviewModel')
const bookModel = require("../models/bookModel")
const { isValidObjectId } = require("mongoose")
const moment = require("moment")

const { isValid, israting, isEmpty } = require("../validators/validator")


const createReview = async function (req, res) {
    try {
        let data = req.body
        let bookId = req.params.bookId;
        data.bookId = bookId
        const { review, rating, reviewedBy } = data
        data.reviewedAt = moment().format()

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid Book Id" })
        }

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty! Provide Data to create review" })
        }

        if (!review) {
            return res.status(400).send({ status: false, message: "Review is mandatory" })
        }

        if (review) {
            if (!isEmpty(review)) return res.status(400).send({ status: false, message: "Review is in Invalid Format" })
            // req.body.review = review.replace(/\s+/g, ' ')
        }

        if (!rating) {
            return res.status(400).send({ status: false, message: "Rating is mandatory" })
        }
        if (!israting(rating)) { return res.status(400).send({ status: false, message: "Rating should be 1 to 5" }) }


        if (!reviewedBy) {
            req.body.reviewedBy = "Guest"
        }

        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: "Your name is in Invalid Format" })
            }
            //  req.body.reviewedBy = reviewedBy.replace(/\s+/g, ' ')
        }

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "Book not found or deleted" })
        }


        const newReview = await reviewModel.create(data)
        const obj = {
            _id: newReview._id,
            bookId: newReview.bookId,
            reviewedBy: newReview.reviewedBy,
            reviewedAt: newReview.reviewedAt,
            rating: newReview.rating,
            review: newReview.review
        }
        const addReview = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true }).lean()


        addReview["reviewsData"] = obj

        return res.status(201).send({ status: true, message: "Review Added", data: addReview })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const updatereview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId)
            return res.status(400).send({ status: false, message: " enter the bookId " })
        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "enter valid bookId" })
        let book = await bookModel.findById(bookId).lean()
        if (!book)
            return res.status(404).send({ status: false, message: " book is not found" })
        if (book.isDeleted == true)
            return res.status(404).send({ status: false, message: " book is already deleted" })
        let review2 = req.params.reviewId
        if (!review2)
            return res.status(400).send({ status: false, message: "reviewId is not found in the params" })
        if (!isValidObjectId(review2))
            return res.status(400).send({ status: false, message: "enter valid reviewId" })
        let reviewPresent = await reviewModel.findById(review2)
        if (!reviewPresent)
            return res.status(404).send({ status: false, message: " review is not found " })
            if(reviewPresent.isDeleted== true)
            return res.status(400).send({status:false, message:"review is already deleted"})
          
        if (!reviewPresent.bookId == bookId)
            return res.status(400).send({ status: false, message: "book cannot be updated" })

        let dataupdating = req.body
        let { reviewedBy, rating, review } = dataupdating
        if (Object.keys(dataupdating).length == 0) {
            return res.status(400).send({ status: false, message: "Enter the data you want to update" })
        }
         if(!israting(rating))
            return res.status(400).send({status:false, message:"rating should br 1 to 5"})    
          
        let dataupdated = await reviewModel.findOneAndUpdate({ _id: review2, isDeleted: false }, 
            { $set: { reviewedBy: reviewedBy , rating: rating , review: review} },{new:true})

            book["reviewsData"]=dataupdated
            return res.status(200).send({status:true,message:"review updated", data: book })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deletereviewById=async function(req,res){
    try{
    let bookId = req.params.bookId
    if(!bookId)
    return res.status(400).send({ status: false, msg: "Enter a book Id" })
    if (!isValidObjectId(bookId)) 
    return res.status(400).send({ status: false, msg: "Enter a valid book Id" })
    let data = await bookModel.findById(bookId)
    if (!data)
     return res.status(404).send({ status: false, msg: "No such book found" })
    if (data.isDeleted==true) 
    return res.status(404).send({ status: false, msg: "Book already deleted" })

    let reviewId=req.params.reviewId
    if(!isValidObjectId(reviewId))return res.status(400).send({status:false,msg:"Enter a valid review Id"})
    let details= await reviewModel.findById(reviewId)
    if (!details) return res.status(404).send({ status: false, msg: "No such review found" })
    if(!details.bookId==bookId)
   return res.status(400).send({status:false,msg:"You can't delete this"})
    if (details.isDeleted)
     return res.status(404).send({ status: false, msg: "review already deleted" })
    let timeStamps = new Date()
    let reviewdelete= await reviewModel.findOneAndUpdate({ _id: reviewId ,isDeleted: false }, { isDeleted: true,  deletedAt: timeStamps })
      data.review-=1
      await data.save()
      res.status(200).send({ status: true, msg: "Review Deleted" })

          }      
          catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
}
module.exports = { createReview ,updatereview , deletereviewById }