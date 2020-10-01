const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Product = require("../models/product")
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
var MultiStream = require('multistream')
const { request } = require("http")

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

global.count = 0

router.post("/deleteProd", (req, res)=>{

  let imgID = req.body.id

  Product.delete(imgID).then((product)=>{
    console.log("successfully deleted")
    global.count=0

    req.session.prods = []
    Product.myProds(req.session.businessName).then((prods)=>{

  
      for(var i=0; i < prods.length; i++){
        console.log(prods[i])
        req.session.prods.push(prods[i])
      }
    })


    Product.allProds().then((allProds)=>{
      req.session.feed = []


      for(var i=0; i < allProds.length; i++){
       
        req.session.feed.push(allProds[i])
      }

    })

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

    

  },(error)=>{
    res.render("bprofile.hbs", {
      error : error
    })
  })

})


router.post("/addProduct", upload.single("addProduct"), (req, res)=>{
  global.count=0
  let name = req.body.productName
  let desc = req.body.description
  

  var product = {
    business: req.session.businessName,
    name: name,
    description: desc,
    filename: req.file.filename,
    originalfilename : req.file.originalname
  }


  Product.create(product).then((product)=>{
      console.log("successful " + product)

      console.log(req.session.prods)
      req.session.prods.push(product)


      Product.allProds().then((allProds)=>{
        req.session.feed = []
  
  
        for(var i=0; i < allProds.length; i++){
         
          req.session.feed.push(allProds[i])
        }
  
      })


      res.render("bprofileEdit.hbs", {
        businessName: req.session.businessName,
        completeName: req.session.completeName,
        username: req.session.username,
        email: req.session.email,
        contactno: req.session.contactno,
        images: req.session.prods,
        description: desc,
        name: name,
        id: req.session.userID,
        logo: req.session.userID
    })

   

  },(error)=>{
    res.render("bprofile.hbs", {
      error : error
    })
  })

})

router.post("/editProd", (req, res)=>{
  console.log("editting product")
  global.count=0
  let name = req.body.editName
  let desc = req.body.editDescription


  var editProduct = {
    business: req.session.businessName,
    name: name,
    description: desc,

  }
  

  Product.edit(req.body.id, name, desc).then((product)=>{
   
    req.session.prods = []
    Product.myProds(req.session.businessName).then((prods)=>{

      for(var i=0; i < prods.length; i++){
        console.log(prods[i])
        req.session.prods.push(prods[i])
      }
    })


    Product.allProds().then((allProds)=>{
      req.session.feed = []


      for(var i=0; i < allProds.length; i++){
       
        req.session.feed.push(allProds[i])
      }

    })


      res.render("bprofileEdit.hbs", {
        businessName: req.session.businessName,
        completeName: req.session.completeName,
        username: req.session.username,
        email: req.session.email,
        contactno: req.session.contactno,
        images: req.session.prods,
        description: desc,
        name: name,
        id: req.session.userID,
        logo: req.session.userID
    })

  },(error)=>{
    res.render("bprofile.hbs", {
      error : error
    })
  })

})

router.post("/addComment", (req, res)=>{
  console.log("adding comment")
  global.count=0
  let username = req.session.username
  let comment = req.body.comment
  let id = req.body.id

  var commentObject = {
    username: username,
    comment: comment
  }

  console.log(username)
  console.log(comment)
  console.log(id)

  Product.addComment(commentObject, id).then((comment)=>{

  req.session.comments = []
  
  req.session.comments.push(comment)
  

  Product.allProds().then((allProds)=>{
    req.session.feed = []


    for(var i=0; i < allProds.length; i++){
     
      req.session.feed.push(allProds[i])
    }
    
    res.render("home.hbs", {
      businessName: req.session.businessName,
      completeName: req.session.completeName,
      username: req.session.username,
      email: req.session.email,
      contactno: req.session.contactno,
      posts: req.session.feed,
      comments: req.session.comments
  
    })
  })

 
  

  })


  
})




router.get("/photo/:id", (req, res)=>{

    fs.createReadStream(path.resolve(UPLOAD_PATH, (req.session.prods[count].filename).toString())).pipe(res)
console.log(count)
  global.count++
  
})





// always remember to export the router for index.js
module.exports = router