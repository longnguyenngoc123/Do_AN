const express=require('express')
const { Mongoose } = require('mongoose')
const customerRouter=require('./routes/customer')
const indexRouter=require('./routes/index')
const categoryRouter=require('./routes/category')
const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts')
const productRouter=require('./routes/product')
const cartRouter=require('./routes/cart')
const passport = require('passport')

const session = require('express-session')
const bcrypt = require('bcrypt')
require('./models/passport.model')(passport)
const app = express()

const mongoose = require("mongoose")
const connectFunction=async()=>{
    try{
        await mongoose.connect('mongodb://localhost/Do_an', {useNewUrlParser: true, useUnifiedTopology: true})
        console.log("Connect successfully")
    }catch(e)
    {
        console.log(e)
    }
}
connectFunction()
app.use(methodOverride('_method'))
app.use(expressLayouts);
app.use(express.urlencoded({extended    : false, limit:'10mb'}))
app.set('layout','layouts/layout')
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:  { maxAge: 60*60*1000}
  }))
  app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  })
app.use(passport.initialize())
app.use(passport.session())
app.use('/category',categoryRouter)
app.use('/product',productRouter)
app.use('/customer',customerRouter)
app.use('/',indexRouter)
app.use('/cart',cartRouter)
app.listen(3000)