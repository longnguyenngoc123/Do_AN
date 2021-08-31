const mongoose=require('mongoose')
const customerSchema = new mongoose.Schema({
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    password:{type:String},    
    date:{type:Date, default:Date.now},
    imageType:{type:String},
    imageData:{type:Buffer},
    gitavatar:{type:String}
})
customerSchema.virtual('imageSrc').get(function(){
    if(this.imageType != null && this.imageData !=null)
    return `data:${this.imageType};charset=utf-8;base64,${this.imageData.toString('base64')}`
})
module.exports=mongoose.model('customer',customerSchema)