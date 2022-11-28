const express = require('express')
const router= express.Router()
const usercontroller=require("../controllers/userController")
// const bookcontrolller=require("../controllers/bookController")
// const reviewcontrolller=require("../controllers/reviewController")


router.post("/register",usercontroller.createuser)


module.exports=router