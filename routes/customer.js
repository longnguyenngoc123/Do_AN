const express=require('express')
const router=express.Router()
const customerModel=require('../models/customer.model')
const passport = require('passport');
const bcrypt = require('bcrypt');
const githubStrategy=require('passport-github').Strategy
const facebookStrategy=require('passport-facebook').Strategy
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
        const customer=await customerModel.find()
        res.render('customer/list',{customer:customer,image:image,git:git,name:value})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})

router.get('/register',async(req,res)=>{
    const customer = new customerModel()
    res.render('customer/register',{customer:customer})
})
router.post('/',async(req,res)=>
{
    const hashed = await bcrypt.hash(req.body.password,10)
    try{
        const cusNew=new customerModel({
            username:req.body.username,
            password:hashed,
            email:req.body.email,
        })
        if (req.body.image != null && req.body.image !== '')
        {
            const imageEncode=JSON.parse(req.body.image)
            cusNew.imageType = imageEncode.type
            cusNew.imageData = new Buffer.from(imageEncode.data,'base64')
        }
        await cusNew.save()
        res.redirect('/customer')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.delete('/delete/:id',async(req,res)=>{
    try{
        await customerModel.findByIdAndDelete(req.params.id)
        res.redirect('/customer')
    }catch(e)
    {
        console.log(e)
        res.redirect('/')
    }
})
router.get('/profile',check,async(req,res)=>
{   
    let value="No Name"
    let email= "No email"
    let image = "No image"
    let git = "No image"
    let date = "No date"
    if(req.user){
        value=req.user.username
        email=req.user.email
        image=req.user.imageSrc
        git = req.user.gitavatar
        date = req.user.date
    }
    res.render('customer/profile', {name:value, email:email,image:image,git:git,date:date})
   
})
router.get('/login',(req,res)=>
{
    res.render('customer/login')
})
router.post('/login',passport.authenticate('local',{
    successRedirect:'/customer/profile',
    failureRedirect:'/customer/login',
    failureFlash:true
}))
router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('login')
})
router.get('/github',passport.authenticate('github'))
router.get('/github/callback',passport.authenticate('github',{
    successRedirect:'/customer/profile',
    failureRedirect:'/customer/login',
    failureFlash:true
}))
router.get('/facebook',passport.authenticate('facebook'))
router.get('/facebook/callback',passport.authenticate('facebook',{
    successRedirect:'/customer/profile',
    failureRedirect:'/customer/login',
    failureFlash:true
}))
module.exports=router