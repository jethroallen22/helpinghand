const mongoose =require("mongoose")

let Business = mongoose.model("business", {
    business: String,
    about: String,
    img:
    {
        data: Buffer,
        contentType:String
    }
})

module.exports = {
    Business
}