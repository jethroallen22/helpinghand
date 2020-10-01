const mongoose =require("mongoose")

let Message = mongoose.model("message", {
    author: String,
    message: String,
    recipient: String
})

module.exports = {
    Message
}