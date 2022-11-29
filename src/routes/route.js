const express = require('express')
const router= express.Router()
const usercontroller=require("../controllers/userController")

 const bookcontrolller=require("../controllers/bookController")
// const reviewcontrolller=require("../controllers/reviewController")


router.post("/register",usercontroller.createuser)
router.post('/login', usercontroller.login);
router.post("/books",bookcontrolller.createBooks)
router.get("/books",bookcontrolller.getbooks)
router.get("/books/:bookId",bookcontrolller.getbooksParams)
router.put("/books/:bookId",bookcontrolller.updateBook)
router.delete("/books/:bookId",bookcontrolller.deleteBookById)
module.exports=router