const express=require('express')
const categoryModel=require('../models/category.model')
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
        const category=await categoryModel.find()
        console.log(category)
        res.render('category/list',{category:category,image:image,git:git,name:value})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.get('/add',(req,res)=>{
    const category=new categoryModel()
    res.render('category/add',{category:category})
})
router.get('/edit/:id',async(req,res)=>{
    try{
        const category=await categoryModel.findById(req.params.id)
        res.render('category/edit',{category:category})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
    
    
})


router.put('/edit/:id',async(req,res)=>{
    try{
        const category = await categoryModel.findById(req.params.id)
        category.name=req.body.name
        await category.save()
        res.redirect("/category")
    }catch(e)
    {
        console.log(e)
        res.redirect('/')
    }
})
router.get('/edit/:id',async(req,res)=>{
    try{
        const category=await categoryModel.findById(req.params.id)
        res.render('category/edit',{category:category})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
    
})

router.post('/',async(req,res)=>{
    try{
        const categoryNew=new categoryModel({
            name:req.body.name
        })
        await categoryNew.save()
        res.redirect('/category')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})

router.delete('/delete/:id',async(req,res)=>{
    try{
        const categoryDelete=await categoryModel.findById(req.params.id)
        await categoryDelete.remove()
        res.redirect('/category')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})

module.exports=router