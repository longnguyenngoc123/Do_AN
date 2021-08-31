const express=require('express')
const categoryModel=require('../models/category.model')
const productModel=require('../models/product.model')
const router=express.Router()
function check(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next()
    }
    res.redirect('/customer/login')
}
router.get('/',check,async(req,res)=>{
    try{
        let image = "No image"
        let git = "No image"
        let value = "No name"
        if(req.user){
            image=req.user.imageSrc
            git = req.user.gitavatar
            value=req.user.username
        }
        const products=await productModel.find().populate('category',['name'])
        res.render('products/list',{products:products,image:image,git:git,name:value})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.get('/add',async(req,res)=>{
    const product=new productModel()
    const categories=await categoryModel.find()
    res.render('products/add',{product:product,categories:categories})
})
router.get('/edit/:id',async(req,res)=>{
    try{
        const categories=await categoryModel.find()
        const product=await productModel.findById(req.params.id)
        res.render('products/edit',{product:product,categories:categories})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
    
})
router.put('/edit/:id',async(req,res)=>{
    try{
        const categories=await categoryModel.find()
        const product=await productModel.findById(req.params.id)
        product.name=req.body.name
        product.info=req.body.info
        product.price=req.body.price
        product.quantity=req.body.quantity
        product.category=req.body.category
        await product.save()
        res.redirect("/product")
    }catch(e)
    {
        console.log(e)
        res.redirect('/')
    }
})

router.post('/',async(req,res)=>{
    try{
        const productNew=new productModel({
            name:req.body.name,
            info:req.body.info,
            quantity:req.body.quantity,
            price:req.body.price,
            category:req.body.category,
        })
        if (req.body.image != null && req.body.image !== '')
        {
            const imageEncode=JSON.parse(req.body.image)
            productNew.imageType = imageEncode.type
            productNew.imageData = new Buffer.from(imageEncode.data,'base64')
        }
       
        await productNew.save()
        res.redirect('/product')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.delete('/delete/:id',async(req,res)=>{
    try{
        const productDelete=await productModel.findById(req.params.id)
        await productDelete.remove()
        res.redirect('/product')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router