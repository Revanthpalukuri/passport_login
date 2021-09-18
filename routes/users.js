const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');
//user model
const User=require('../models/User')
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
    res.render('register');
})
router.post('/register',(req,res)=>{
    /*  console.log(req.body);*/
    const {name,email,password,password2}=req.body;
let errors=[];
if(!name || !email || !password || !password2) errors.push({msg:'please fill all fields'});
if(password2!=password) errors.push({msg:"passwords doesnt match"});
if(password.length <6) errors.push({msg:'password length must be min 6 characters'});
if(errors.length==0)
{
    //res.send('pass');
    //validation passes
    User.findOne({email:email})
    .then((user)=>{
        if(user){
        //user already exists
        errors.push({msg:"email is already registered"})
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
        }
        else 
        {
            const newUser=new User({
                name,
                email,
                password,
                password2
            });
            console.log(newUser);
            //hash password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  //set password to hash
                  newUser.password = hash;
                  //save user
                  newUser
                    .save()
                    .then(user => {
                      res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                });
              });
            res.render('login');
        }
    })
}
else 
{
    res.render('register',{
        errors,
        name,
        email,
        password,
        password2
    });
}

})

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
module.exports=router;