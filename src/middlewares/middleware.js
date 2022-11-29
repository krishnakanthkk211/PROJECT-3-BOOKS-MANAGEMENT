
const authorization = async function(req,res,next){
    try{
       token= req.headers ['x-api-token']
       if(!token)
       return res.status(400).send("Token is not present")
       let check= jwt.verify(token , "Neemo")
       if(!check)
       return res.status(401).send("User not authenticated")

    }
    catch(err){
       return res.status(500).send(err.message)
    }
}
