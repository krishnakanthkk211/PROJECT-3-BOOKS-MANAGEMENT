const isValidemail = function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const isValidphone = function (phone) {
    return /^([+]\d{2})?^\d{10}$/.test(phone);
  
}

function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return re.test(str);
}


const isValid=function(name){
    const value = /^[a-zA-Z( \)]{2,50}$/
    return value.test(name)

}

const isEmpty = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidpincode=function validatePIN (pincode) {
      return /^(\d{4}|\d{6})$/.test(pincode)
  
  }
const isValidISBN=function(ISBN) {
    return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN);
}
module.exports={isValidemail,isValidphone,checkPassword, isValid,isValidpincode,isValidISBN}