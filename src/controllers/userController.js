const jwt=require("jsonwebtoken")
const userModel=require("../models/userModel")
const validator=require("../validators/validator")
const{isValidemail,isValidphone,isValid,checkPassword,isValidpincode}=validator
const createuser=async function(req,res){
    try{
        let data=req.body
        let{title,name,phone,email,password,address}=data
        let{street,city,pincode}=address
        if(Object.keys(data).length==0)
        {return res.status(400).send({status:false,message:"enter data for create user"})}
        if(!title)
        {return res.status(400).send({status:false,message:"title is required"})}
        if(!name)
        {return res.status(400).send({status:false,message:"name is required"})}
        if(!phone)
        {return res.status(400).send({status:false,message:"phone is required"})}
        if(!email)
        {return res.status(400).send({status:false,message:"email is required"})}
        if(!password)
        {return res.status(400).send({status:false,message:"password is required"})}
        if(!address)
        {return res.status(400).send({status:false,message:"address is required"})}
        if(Object.keys(address).length==0)
        {return res.status(400).send({status:false,message:"enter all fields of address"})}
        if(!street)
        {return res.status(400).send({status:false,msg:"street is required"})}
        if(!city)
        {return res.status(400).send({status:false,msg:"city is required"})}
        if(!pincode)
        {return res.status(400).send({status:false,msg:"pincode is required"})}
        let enums = userModel.schema.obj.title.enum;
        if(!enums.includes(title))
        {return res.status(400).send({status:false, message :"Please enter a valid title"})}
        if(!isValid(name))
        {return res.status(400).send({status:false,message:"enter valid name"}) }
        if(!isValidemail(email))
        {return res.status(400).send({status:false,message:"enter valid email"})}
        if(!isValidphone(phone))
        {return res.status(400).send({status:false,message:"enter valid phone"})}
        if(!checkPassword(password))
        {return res.status(400).send({status:false,message:"enter valid password"})}
        if(!isValid(city))
        {return res.status(400).send({status:false,message:"city is in valid"})}
        if(!isValidpincode(pincode))
        {return res.status(400).send({status:false,message:"enter valid pincode"})}
        let dublicateemail=await userModel.findOne( {email:email})
        if(dublicateemail)
        {return res.status(400).send({status:false,message:"email already existed"})}
        let dublicatephone=await userModel.findOne({phone:phone})
        if(dublicatephone)
        {return res.status(400).send({status:false,message:"phone already existed"})}

        let userdata=await userModel.create(data)
        res.status(201).send({status:true,message:"Success",data:userdata})
    }
    catch(err)
    { res.status(500).send({status:false,message:err.message})}
  }



const login = async function (req, res) {
    try {
      let data= req.body
      if(Object.keys(data).length==0)
      {return res.status(400).send({status:false,message:"please enter email and password"})}
      let{email,password}=data
      if(!email)
        {return res.status(400).send({status:false,message:"email is required"})}
      if(!password)
        {return res.status(400).send({status:false,message:"password is required"})}
      if(!isValidemail(email))
        {return res.status(400).send({status:false, msg:"please give a valid email😟😟😟"})}
      if(!checkPassword(password))
        {return res.status(400).send({status:false, msg:"please give a valid password😟😟😟"})} 
      
      const Data = await userModel.findOne({ email: email, password: password })
      if (!Data) {
        return res.status(400).send({ status: false,msg: "emaile or the password is not corerct🤨🤨🤨" });
      }
      let token = jwt.sign( {userId: Data._id},"Neemo",{expiresIn:"10min"})
      res.status(200).send({ status: true, message:"login successfully" ,token:token})
    }
    catch (error) {
      res.status(500).send({status:false, message: error })
    }
  }


 
module.exports={createuser,login}