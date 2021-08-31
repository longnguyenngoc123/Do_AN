const localStrategy=require('passport-local').Strategy
const customerModel=require('./customer.model')
const githubStrategy=require('passport-github').Strategy
const facebookStrategy=require('passport-facebook').Strategy
const bcrypt = require('bcrypt');
module.exports=function(passport)
{
    passport.serializeUser(function(user,done)
    {
        done(null,user.id);
    })
    passport.deserializeUser(async(id,done)=>{
        try{
            const user= await customerModel.findById(id)
            return done(null,user)
        }catch(e){
            return done(e)
        }
    })
    passport.use(new localStrategy(
        {
            usernameField:'email',
            passwordField:'password'
        },
        async function(email,password,done)
        {
            const user=await customerModel.findOne({'email':email})
            if(!user){
                return done(null,false)
            }
            try{
                if(await bcrypt.compare(password,user.password)){
                    return done(null,user)
                }
                return done(null,false)
            }catch(e){
                return done(e)
            }
        }
    ))
    passport.use(new githubStrategy({
        clientID:"599aba6e1909c5dce9e1",
        clientSecret:"eb478ab6f687e9d1042aa7c04c8e9b826110cb11",
        callbackURL:"http://localhost:3000/customer/github/callback"
    },
    async function(accessToken,refreshToken,profile,done)
    {
        try{
            const user=await customerModel.findOne({email:profile._json.login})
            if(user) return done(null,user)
            const newUser=new customerModel({
                username:profile._json.id,
                email:profile._json.login,
                gitavatar:profile._json.avatar_url,
                pasword:""
            })
            
            await newUser.save()
            return done(null, newUser)
        }catch(e){
            console.log(e)
            return done(e)
        }
    }
    ))
    passport.use(new facebookStrategy({
        clientID:"384488659699339",
        clientSecret:"e956d07b5fdc764b9fe667d7299d3502",
        callbackURL:"http://localhost:3000/customer/facebook/callback"
    },
    async function(accessToken,refreshToken,profile,done)
    {
        console.log(profile);
        try{
            const user=await customerModel.findOne({email:profile._json.login})
            if(user) return done(null,user)
            const newUser=new customerModel({
                username:profile._json.id,
                email:profile._json.login,
                gitavatar:profile._json.avatar_url,
                pasword:""
            })
            
            await newUser.save()
            return done(null, newUser)
        }catch(e){
            console.log(e)
            return done(e)
        }
    }
    ))
}
