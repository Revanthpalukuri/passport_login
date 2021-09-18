const express=require('express');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const session=require('express-session');
const flash = require('connect-flash');
const passport=require('passport')
const port=8000;
//db config
const db=require('./config/keys').MongoURI;
//passport config
require('./config/passport')(passport);

//connect to mongoose
mongoose.connect(db)
.then(()=>{
    console.log('mongodb connected....')
})
.catch((err)=>{
    console.log(err);
})

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');
//bodyparser
app.use(express.urlencoded({extended:false}));
//express session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))
  //passport middle ware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

app.listen(port,()=>{
    console.log(`the port is at ${port}`);
})