const mongoose = require("mongoose")
const crypto = require("crypto")

var userSchema = mongoose.Schema({
    username: String,
    fullname: String,
    password: String,
    email: String,
    contactNum: String,
    businessName:String,
    filename: String,
    originalfilename: String
    })

userSchema.pre("save", function(next){
  this.password = crypto.createHash("md5").update(this.password).digest("hex")
  next()
})

var User = mongoose.model("user", userSchema)

exports.create = function(user){
    return new Promise(function(resolve, reject){
      console.log(user)
      var u = new User(user)
        
      u.save().then((newUser)=>{
        console.log(newUser)
        resolve(newUser)
      }, (err)=>{
        reject(err)
      })


    })
  }

exports.checkUsername = function(username){
    return new Promise(function(resolve, reject){

      User.findOne({username: username}).then((user)=>{
        resolve(user)
      }, (err)=>{
        reject(err)
      })

    })
  }

exports.checkEmail = function(email){
    return new Promise(function(resolve, reject){

      User.findOne({email: email}).then((user)=>{
        resolve(user)
      }, (err)=>{
        reject(err)
      })

    })
  }



exports.authenticate = function(user){

  return new Promise(function(resolve, reject){
    console.log("in promise : " + user.username)

    User.findOne({
      username : user.username,
      password : crypto.createHash("md5").update(user.password).digest("hex")
    }).then((user)=>{
      console.log("callback user : " + user)
      resolve(user)
    },(err)=>{
      reject(err)
    })
  })
}

exports.get = function(id){
  return new Promise(function(resolve, reject){
    User.findOne({_id:id}).then((user)=>{
      resolve(user)
    }, (err)=>{
      reject(err)
    })
  })
}


exports.getLogo = function(business){
  return new Promise(function(resolve, reject){
    User.findOne({businessName: business}).then((business)=>{
      
      resolve(business)
    }, (err)=>{
      reject(err)
    })
  })
}
