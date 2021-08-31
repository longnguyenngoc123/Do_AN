const express=require('express')
const categoryModel=require('../models/category.model')
const productModel=require('../models/product.model')
const router=express.Router()

router.get('/',async(req,res)=>{
    try{
        const products=await productModel.find().populate('category',['name'])
        res.render('index',{products:products})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
module.exports=router

