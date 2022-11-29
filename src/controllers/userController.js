const jwt = require('jsonwebtoken')
const userModel=require("../models/userModel")
const validator=require("../validators/validator")
const{isValidemail,isValidphone,isValidname,checkPassword}=validator
const createuser=async function(req,res){
    try{
        let data=req.body
        let{title,name,phone,email,password,address}=data
        
        if(Object.keys(data).length==0)
        {return res.status(400).send({status:false,message:"enter data for create user"})}
        if(!title)
        {return res.status(400).send({status:false,message:"title is required"})}
        if(!isEmpty(title)) 
      return res.status(400).send({ status: false, msg: "title cannot be empty "}) 
      
        if(!name)
        {return res.status(400).send({status:false,message:"name is required"})}
        if(!isEmpty(name)) 
        return res.status(400).send({ status: false, msg: "name cannot be empty "}) 
        
        if(!phone)
        {return res.status(400).send({status:false,message:"phone is required"})}
        if(!isEmpty(phone)) 
      return res.status(400).send({ status: false, msg: "phone cannot be empty "}) 
      
        if(!email)
        {return res.status(400).send({status:false,message:"email is required"})}
        if(!isEmpty(email)) 
      return res.status(400).send({ status: false, msg: "email cannot be empty "}) 
      
        if(!password)
        {return res.status(400).send({status:false,message:"password is required"})}
        if(!isEmpty(password)) 
      return res.status(400).send({ status: false, msg: "password cannot be empty "}) 
      
        if(!address)
        {return res.status(400).send({status:false,message:"address is required"})}
        if(!isEmpty(address)) 
      return res.status(400).send({ status: false, msg: "address cannot be empty "}) 
      
        let enums = userModel.schema.obj.title.enum;
        if(!enums.includes(title))
        {return res.status(400).send({status:false, message :"please enter a valid title"})}
        if(!isValidname(name))
        {return res.status(400).send({status:false,message:"enter valid name"}) }
        if(!isValidemail(email))
        {return res.status(400).send({status:false,message:"enter valid email"})}
        if(!isValidphone(phone))
        {return res.status(400).send({status:false,message:"enter valid phone"})}
        if(!checkPassword(password))
        {return res.status(400).send({status:false,message:"enter valid password"})}
        
        let dublicateemail=await userModel.findOne({email:email}||{phone:phone})
        if(dublicateemail)
        {return res.status(400).send({status:false,message:"email already existed"})}
        let dublicatephone=await userModel.findOne({phone:phone})
        if(dublicatephone)
        {return res.status(400).send({status:false,message:"phone already existed"})}

        let userdata=await userModel.create(data)
        res.status(201).send({status:true,message:"Success",data:userdata})
    }
    catch(err)
    {return res.status(400).send({status:false,message:err.message})}
}



const login = async function (req, res) {
    try {
      let{email,password}= req.body
      if(!email)
        {return res.status(400).send({status:false,message:"email is required"})}
      if(!password)
        {return res.status(400).send({status:false,message:"password is required"})}
      if(!isValidemail(email)){
        return res.status(400).send({status:false, msg:"please give a valid email"})
      }
      if(!checkPassword(password)){
        return res.status(400).send({status:false, msg:"please give a valid password"}) 
      }
  
      const Data = await userModel.findOne({ email: email, password: password })
  
      if (!Data) {
        return res.status(400).send({ status: false,msg: "emaile or the password is not corerct" });
      }
      let token = jwt.sign( {userId: Data._id},"Neemo",{expireIn:"10min"})
      res.status(201).send({ status: true, msg: token })
    }
    catch (error) {
      res.status(500).send({ msg: error })
    }
  }


 
module.exports={createuser,login}