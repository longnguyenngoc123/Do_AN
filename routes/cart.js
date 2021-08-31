const express=require('express')
const productModel=require('../models/product.model')
const cartModel = require('../models/cart.model')
const orderModel = require('../models/order.model')

const router=express.Router()
router.get('/',check,async(req,res)=>{
    try{
        let cart=[]
        let total=0
        if(req.session.cart)
        {
            cart=req.session.cart.items
            total=req.session.cart.Totalprice
        }
        res.render('carts/cart',{cart:cart, total:total})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }  
})
router.get('/add/:id',async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.id)
        const cart = new cartModel(req.session.cart ? req.session.cart:{items:[]})
        cart.add(product,req.params.id,product.imageSrc)
        req.session.cart = cart
        res.redirect('/cart')
    }catch(e){
        console.log(e.message)
        res.redirect('/')
    }
    
})

router.get('/reduce/:id',async(req,res)=>{
    try{
        const id=req.params.id
        const cart=new cartModel(req.session.cart)
        cart.reduce(id)
        req.session.cart=cart 
        res.redirect('/cart')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
    
})
function check(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next()
    }
    res.redirect('/customer/login')
}
router.get('/increase/:id',async(req,res)=>{
    try{
        const id=req.params.id
        const cart=new cartModel(req.session.cart)
        cart.increase(id)
        req.session.cart=cart 
        res.redirect('/cart')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.post('/delete/:id',(req,res)=>{
    try{
        const cart = new cartModel(req.session.cart)
        cart.delete(req.params.id)
        req.session.cart = cart
        res.redirect('/cart')
    }catch(e){
        console.log(e.message)
        res.redirect('/')
    }
    
})

router.get('/checkout',check,(req,res)=>{
    let value="No Name"
    let email= "No email"
    if(req.user){
        value=req.user.username
        email=req.user.email
    }
    if(!req.session.cart)
    {
        res.redirect('/cart')
    }
    const cart=new cartModel(req.session.cart)
    const total= new Intl.NumberFormat().format(cart.Totalprice)
    res.render("carts/checkout",{products:cart.items,total:total,name:value, email:email})
})
router.post('/order',check,async(req,res)=>{
    try{
        const cart = new cartModel(req.session.cart)
        const order = new orderModel({
            user:req.user,
            cart:cart,
            address:req.body.address
        })
        req.session.cart=null
        await order.save()
        res.redirect('/')
    }catch(e){
        console.log(e.message)
        res.redirect('/cart/checkout')
    }
})


module.exports = router