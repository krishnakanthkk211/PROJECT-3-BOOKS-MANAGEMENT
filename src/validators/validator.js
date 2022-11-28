const isValidemail = function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const isValidphone = function (phone) {
    return /^([+]\d{2})?\d{10}$/.test(phone);
}

function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return re.test(str);
}

const isValidname =function(name){
    return /^[a-zA-Z]+([_-]?[a-zA-Z])*$/.test(name)
}

module.exports={isValidemail,isValidphone,checkPassword, isValidname}