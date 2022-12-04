const express = require('express')
const router= express.Router()
const usercontroller=require("../controllers/userController")
const bookcontrolller=require("../controllers/bookController")
const middle= require("../middlewares/middleware")
const review= require("../controllers/reviewController")


//all the apis
router.post("/register",usercontroller.createuser)
router.post('/login', usercontroller.login)

router.post("/books", middle.authenticate, middle.authorize, bookcontrolller.createBooks)
router.get("/books", middle.authenticate, bookcontrolller.getbooks)
router.get("/books/:bookId",middle.authenticate, bookcontrolller.getbooksParams)
router.put("/books/:bookId",middle.authenticate,middle.authorize, bookcontrolller.updateBook)
router.delete("/books/:bookId",middle.authenticate, middle.authorize, bookcontrolller.deleteBookById)
 
router.post("/books/:bookId/review", review.createReview)
router.put("/books/:bookId/review/:reviewId", review.updatereview )
router.delete("/books/:bookId/review/:reviewId", review.deletereviewById)

module.exports=router