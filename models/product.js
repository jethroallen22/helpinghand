
const mongoose = require("mongoose")
mongoose.set('useFindAndModify', false);

var producSchema = mongoose.Schema({
    business: String,
    name: String,
    description: String,
    filename: String,
    originalfilename: String
})


var Product = mongoose.model("product", producSchema)

exports.create = function(product){
  return new Promise(function(resolve, reject){
    console.log(product)
    var p = new Product(product)

    p.save().then((newProduct)=>{
      console.log(newProduct)
      resolve(newProduct)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.delete = function(id){
  return new Promise(function(resolve, reject){
    Product.deleteOne({_id: id}).then((doc)=>{
      resolve(doc)

      }, (err)=>{
        console.log(err)

      })
})
}

exports.myProds = function(business){

  return new Promise(function(resolve, reject){

    Product.find({business: business}).then((prods)=>{
      resolve(prods)
    }, (err)=>{
      reject(err)
    })
  })


}

exports.edit = function(id, name, desc){

  return new Promise(function(resolve, reject){

    Product.findOneAndUpdate({_id: id}, {

      name: name,
      description:desc,

    }).then((prod)=>{
      resolve(prod)
    }, (err)=>{
      reject(err)
    })
  })


}

exports.allProds = function(){
  return new Promise(function(resolve, reject){
    Product.find({}).then((allProds)=>{
      resolve(allProds)
    }, (err)=>{
      reject(err)
    })
  })
}