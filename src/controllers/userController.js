const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const validator = require("../validators/validator")
const { isValidemail, isValidphone, isValid, checkPassword, isValidpincode, isEmpty } = validator


const createuser = async function (req, res) {
  try {
    let data = req.body
    let { title, name, phone, email, password, address } = data
    let { street, city, pincode } = address
    if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "enter data for create user" }) }
    if (!title) { return res.status(400).send({ status: false, message: "title is required" }) }
    if (!isEmpty(title))
      return res.status(400).send({ status: false, message: "title cannot be empty " })

    if (!name) { return res.status(400).send({ status: false, message: "name is required" }) }
    if (!isEmpty(name))
      return res.status(400).send({ status: false, message: "name cannot be empty " })

    if (!phone) { return res.status(400).send({ status: false, message: "phone is required" }) }
    if (!isEmpty(phone))
      return res.status(400).send({ status: false, message: "phone cannot be empty " })

    if (!email) { return res.status(400).send({ status: false, message: "email is required" }) }
    if (!isEmpty(email))
      return res.status(400).send({ status: false, message: "email cannot be empty " })

    if (!password) { return res.status(400).send({ status: false, message: "password is required" }) }
    if (!isEmpty(password))
      return res.status(400).send({ status: false, message: "password cannot be empty " })

    if (!address) { return res.status(400).send({ status: false, message: "address is required" }) }
    if (Object.keys(address).length == 0) { return res.status(400).send({ status: false, message: "enter all fields of address" }) }
    if (!isEmpty(address))
      return res.status(400).send({ status: false, message: "address cannot be empty " })
    if (!street) { return res.status(400).send({ status: false, message: "street is required" }) }
    if (!city) { return res.status(400).send({ status: false, message: "city is required" }) }
    if (!pincode) { return res.status(400).send({ status: false, message: "pincode is required" }) }
    let enums = userModel.schema.obj.title.enum;
    if (!enums.includes(title)) { return res.status(400).send({ status: false, message: "Please enter a valid title" }) }
    if (!isValid(name)) { return res.status(400).send({ status: false, message: "enter valid name" }) }

    if (!isValidemail(email)) { return res.status(400).send({ status: false, message: "enter valid email" }) }
    if (!isValidphone(phone)) { return res.status(400).send({ status: false, message: "enter valid phone(indian number of 10 digits(starting with 6,7,8,9)" }) }
    if (!checkPassword(password)) { return res.status(400).send({ status: false, message: "password must have 1 lowercase, 1uppercase and a special characters ; all in 8-15 characters" }) }
    if (!isValid(city)) { return res.status(400).send({ status: false, message: "city is in valid" }) }
    if (!isValidpincode(pincode)) { return res.status(400).send({ status: false, message: "pincode should be of 6 numeric values" }) }
    let dublicateemail = await userModel.findOne({ email: email })
    if (dublicateemail) { return res.status(400).send({ status: false, message: "email already existed" }) }
    let dublicatephone = await userModel.findOne({ phone: phone })
    if (dublicatephone) { return res.status(400).send({ status: false, message: "phone already existed" }) }

    let userdata = await userModel.create(data)
    res.status(201).send({ status: true, message: "Success", data: userdata })
  }
  catch (err) { res.status(500).send({ status: false, message: err.message }) }
}



const login = async function (req, res) {
  try {
    let data = req.body
    if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "please enter email and password" }) }
    let { email, password } = data
    if (!email) { return res.status(400).send({ status: false, message: "email is required" }) }
    if (!password) { return res.status(400).send({ status: false, message: "password is required" }) }
    if (!isValidemail(email)) { return res.status(400).send({ status: false, message: "please give a valid email" }) }
    if (!checkPassword(password)) { return res.status(400).send({ status: false, message: "password must have 1 lowercase, 1uppercase and a special characters ; all in 8-15 characters" }) }

    const Data = await userModel.findOne({ email: email, password: password })
    if (!Data) {
      return res.status(400).send({ status: false, message: "emaile or the password is not corerct" });
    }

    let token = jwt.sign({ userId: Data._id.toString() }, "Neemo", { expiresIn: "24hr" })
    let decode = jwt.decode(token, "Neemo")
    const tokeniat = new Date(decode.iat * 1000).toLocaleString()
    const tokenexp = new Date(decode.exp * 1000).toLocaleString()

    res.status(201).send({ status: true, message: "User logged in Successfully", data: { token: token, userId: decode.userId, iat: tokeniat, exp: tokenexp } })
  }

  catch (err) {
    res.status(500).send({ status: false, message: err })
  }
}



module.exports = { createuser, login }