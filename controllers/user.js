const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Product = require("../models/product")
const app = express()


const urlencoder = bodyparser.urlencoded({
  extended : true
})

router.use(urlencoder)

const UPLOAD_PATH = path.resolve(__dirname, "../uploads")
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize : 10000000,
    files : 2
  }
})

router.get("/photo/:id", (req, res)=>{


    fs.createReadStream(path.resolve(UPLOAD_PATH, (req.session.logo).toString())).pipe(res)

  
})


// localhost:3000/user/register
router.post("/register", upload.single("businessLogo"), (req, res)=>{
  
  let username = req.body.username
  let fullname = req.body.cn
  let password = req.body.password
  let email = req.body.email
  let contactno = req.body.contactNum
  let businessname = req.body.businessName



if(!req.file){
  var newUser = {
    username: username,
    email: email,
    fullname: fullname,
    contactNum: contactno,
    password:password
  }
} else{
  var newUser = {
    username: username,
    email: email,
    fullname: fullname,
    contactNum: contactno,
    password:password,
    businessName: businessname,
    filename: req.file.filename,
    originalfilename : req.file.originalname
  }

}

User.checkUsername(username).then((user)=>{
  
  if(user){
    res.render("register.hbs", {
      error: "Username already exists"
  })
  }
  else{
    User.checkEmail(email).then((user)=>{
  
      if(user){
        res.render("register.hbs", {
          error: "email already exists"
      })
      }
      else{
        console.log("you are clear 2")
        
        User.create(newUser).then((user)=>{
          console.log("successful " + user)

          console.log(user.businessName)
          if(user){
            
            req.session.userID = user._id
            req.session.username = user.username,
            req.session.completeName = user.fullname,
            req.session.email = user.email,
            req.session.contactno = user.contactNum
            req.session.prods = []

            if(user.businessName){
              console.log("I FOUND A BUSINESS NAME")
                req.session.businessName= user.businessName
                req.session.logo= user.filename
            }else{
              console.log("i didnt find a business name")
              req.session.businessName= ""
              console.log(user.businessName)
            }
    
          }

          Product.allProds().then((allProds)=>{
            req.session.feed = []
    
    
            for(var i=0; i < allProds.length; i++){
             
              req.session.feed.push(allProds[i])
            }
    
            console.log(req.session.prods)
    
             res.render("home.hbs", {
                businessName: req.session.businessName,
                completeName: req.session.completeName,
                username: req.session.username,
                email: req.session.email,
                contactno: req.session.contactno,
                posts: req.session.feed,
      
              })
    
          })
          

    
      },(error)=>{
        res.render("register.hbs", {
          error : error
        })
      })

      }
    })
  }
})


})

// localhost:3000/user/login
router.post("/login", (req, res)=>{
  console.log("POST /user/login")
  let user = {
    username : req.body.username,
    password : req.body.password
  }

  console.log("post login " + req.body.username)
  console.log("post login " + user)

  User.authenticate(user).then((newUser)=>{
    console.log("authenticate " + newUser)
    if(newUser){

      req.session.userID = newUser._id
      req.session.username = newUser.username,
      req.session.completeName = newUser.fullname,
      req.session.email = newUser.email,
      req.session.contactno = newUser.contactNum,
      req.session.count= 0
      if(newUser.businessName !== ""){
          req.session.businessName= newUser.businessName
          req.session.logo= newUser.filename
      }else{
        req.session.businessName= ""
      }

      Product.myProds(req.session.businessName).then((prods)=>{
        req.session.prods = []
        
        for(var i=0; i < prods.length; i++){
         
          req.session.prods.push(prods[i])
        }

      })

      Product.allProds().then((allProds)=>{
        req.session.feed = []


        for(var i=0; i < allProds.length; i++){
         
          req.session.feed.push(allProds[i])
        }

        console.log(req.session.prods)

         res.render("home.hbs", {
            businessName: req.session.businessName,
            completeName: req.session.completeName,
            username: req.session.username,
            email: req.session.email,
            contactno: req.session.contactno,
            posts: req.session.feed,
  
          })

      })



    }           //end of if new user

  }, (error)=>{
    res.render("signin.hbs",{
      error : "incorrect username or password"
    })
  })

})




// always remember to export the router for index.js
module.exports = router