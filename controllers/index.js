const express = require("express")
const router = express.Router()
const app = express()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
var MultiStream = require('multistream')
const Product = require("../models/product")
const User = require("../models/user")

// load all the controllers into router
router.use("/user", require("./user"))
router.use("/product", require("./product"))

const UPLOAD_PATH = path.resolve(__dirname, "../uploads")


router.get("/", function(req, res){
    console.log("count is now" + req.session.count)
    global.count=0
    global.visit=0
    if(req.session.username){
        console.log(req.session.username)
        console.log(req.session.feed)
        res.render("home.hbs", {
            businessName: req.session.businessName,
            completeName: req.session.completeName,
            username: req.session.username,
            email: req.session.email,
            contactno: req.session.contactno,
            posts: req.session.feed
  
          })

    }else{
        
            res.render("signin.hbs")
    }
  
  })

router.get("/register", (req, res) =>{
    res.render("register.hbs")
})

router.get("/profile", (req, res) =>{
    global.count=0
    global.visit=0
    if(req.session.businessName !== ""){
      
        res.render("bprofileEdit.hbs", {
            businessName: req.session.businessName,
            completeName: req.session.completeName,
            username: req.session.username,
            email: req.session.email,
            contactno: req.session.contactno,
            images: req.session.prods,
            id: req.session.userID,
            logo: req.session.userID
        })
    } else{

        console.log(req.session.username)
        res.render("profile.hbs", {
            completeName: req.session.completeName,
            username: req.session.username,
            email: req.session.email,
            contactno: req.session.contactno
        })
    }

})

router.get("/bprofile/:business", (req, res) =>{
    global.count=0
    global.visit=0
    req.session.visitprods = []

    Product.myProds(req.params.business).then((prods)=>{

        console.log(prods.length)
      for(var i=0; i < prods.length; i++){
        
        req.session.visitprods.push(prods[i])
      }
    })

    User.getLogo(req.params.business).then((logo)=>{
        req.session.visitLogo = logo
        req.session.idLogo = logo._id

        res.render("bprofile.hbs", {
            username: req.session.username,
            products: req.session.visitprods,
            business: req.params.business,
            logo: req.session.idLogo
        })
      })
   
    
 
  

})


router.get("/signout", (req, res) =>{
    req.session.destroy()
    res.redirect("/")

})


router.get("/photo/:id", (req, res)=>{

    fs.createReadStream(path.resolve(UPLOAD_PATH, (req.session.feed[count].filename).toString())).pipe(res)

  global.count++
  
})


router.get("/visit/:id", (req, res)=>{
 
    console.log(count)
    fs.createReadStream(path.resolve(UPLOAD_PATH, (req.session.visitprods[visit].filename).toString())).pipe(res)

  global.visit++
  
})

router.get("/logo/:id", (req, res)=>{
    
console.log(req.session.visitLogo.filename)
    fs.createReadStream(path.resolve(UPLOAD_PATH, (req.session.visitLogo.filename).toString())).pipe(res)

  global.count++
  
})


module.exports = router