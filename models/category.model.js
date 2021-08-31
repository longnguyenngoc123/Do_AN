const mongoose=require("mongoose")
const categorySchema=new mongoose.Schema
({
    name:{type:String, require:true, default:"Etc."}
})

categorySchema.pre('remove',async function(next){
    try{
        console.log({category:this.id})
        const product=await productModel.find({category:this.id})
        if(product.length>0){
            console.log('test st')
            next(new Error("Khong xoa dc"))
        }
    }catch(e)
    {
        next()
    }
})
module.exports=mongoose.model('category',categorySchema)
