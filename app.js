//jshint esversion:6

const express=require("express")
const app=express()
app.set('view engine','ejs')
const mongoose=require('mongoose')
mongoose.connect("mongodb+srv://Sai_99:shirdisai@cluster0-4bk2v.mongodb.net/yelpcampDB",{useNewUrlParser:true})

const bodyParser=require("body-parser")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const passportLocalMongoose=require("passport-local-mongoose")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
const methodOverride=require("method-override")
app.use(methodOverride("_method"))

var flash=require("connect-flash")

app.use(flash())
var seedDB   =require("./seeds")
const User=require("./models/user")
const Campground=require("./models/campground")
const Comment=require("./models/comment")
app.use(require("express-session")({
secret:"1234",
unsave:false,
saveUnitialized:false

}))


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{

  res.locals.currentUser=req.user;
res.locals.error=req.flash("error");
res.locals.success=req.flash("success");
  next();
})

app.get("/",(req,res)=>{
res.render("landing")})


app.get("/index",(req,res)=>{
Campground.find({},(err,campgrounds)=>{
  if(!err)
{  res.render("campgrounds/index",{campgrounds:campgrounds,currentUser:req.user})}
else{
console.log(err);}
})
}
)
 //seedDB();

app.post("/campgrounds",isLoggedIn,(req,res)=>{
var name=req.body.name;
var image=req.body.image;
var description=req.body.description;
var  price=req.body.price;
var author={
  id:req.user._id,
  username:req.user.username
}
var newcampground={name:name,price:price,image:image,description:description,author:author}
//campgrounds.push(newcampground)

Campground.create(newcampground,function(err,campground){
if(err)
console.log(err);
res.redirect("/index")
})


})
app.get("/campgrounds/new",isLoggedIn,(req,res)=>{
  res.render("campgrounds/new")
})

app.get("/campgrounds/:id",(req,res)=>{
Campground.findById(req.params.id).populate("comments").exec(function(err,found){
  if(!err)
    res.render("campgrounds/show",{campground:found})
})

})



//Campground.create({name:"cougar photobomb",image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
//description:"This is a photobomb!"},function(err,campground){
//if(err)
//console.log(err);
//})

//var campgrounds=[
//
//{name:"cougar photobomb",image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
//{name:"cougar photobomb",image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
//{name:"cougar photobomb",image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
//{name:"cougar photobomb",image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
//{name:"cougar photobomb",image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
//{name:"cougar photobomb",image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"}
//]



app.post("/campgrounds/:id/comments",isLoggedIn,(req,res)=>{


  Campground.findById(req.params.id,(err,campground)=>{
    if(err)
  {  console.log(err);
    redirect("/campgrounds")

  }  else {

    Comment.create(req.body.comment,(err,comment)=>{
      if(err)
      console.log(err);
      else{
        comment.author.id=req.user._id;
        comment.author.username=req.user.username
        comment.save()
        campground.comments.push(comment)
        campground.save()
        req.flash("success","Successfully Added Comment!")

        res.redirect("/campgrounds/"+campground._id)
      }
    })
    }
  })
})


app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
Campground.findById(req.params.id,(err,campground)=>{
if(err)
console.log(err);
else
res.render("comments/new",{campground:campground})

})

}
)



//app.get("/campgrounds/:id/comments",(req,res)=>{
//
//res.redirect("/campgrounds/:id")
//




app.get("/register",(req,res)=>{
  res.render("register")
})

app.post("/register",(req,res)=>{
User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
if(err)
{  req.flash("error",err.message)

  console.log(err);
  return res.render("register")
}
passport.authenticate("local")(req,res,()=>{
  req.flash("success","Welcome to Yelpcamp "+ user.username)

res.redirect("/index")

})
})
})


app.get("/login",(req,res)=>{
  res.render("login")

})


app.post("/login",passport.authenticate("local",{
  successRedirect:"/index",
  failureRedirect:"/login"
}),(req,res)=>{

} )

app.get("/logout",(req,res)=>{
req.logout();
req.flash("success","Logged you out!")
res.redirect("/index")

})


//edit

app.get("/campgrounds/:id/edit",check,(req,res)=>{


    Campground.findById(req.params.id,(err,found)=>{


  res.render("campgrounds/edit",{campground:found})
})


})

app.put("/campgrounds/:id",check,(req,res)=>{

Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,update)=>{
  if(err){
    res.redirect("/index")
  }
  else{
    req.flash("success","Campground Updated!")
res.redirect("/index")
    res.redirect("/campgrounds/"+req.params.id)
  }
})

})

//destroy

app.delete("/campgrounds/:id",check,(req,res)=>{
  Campground.findByIdAndRemove(req.params.id,(err)=>{
    if(err)
    res.redirect("/index")
    else{req.flash("success","Campground deleted!")
res.redirect("/index")

    }
  })
})














//edit comments

app.get("/campgrounds/:id/comments/:comment_id/edit",checkcmnt,(req,res)=>{
  Comment.findById(req.params.comment_id,(err,found)=>{

if(err)
res.redirect("back")
else
res.render("comments/edit",{campground_id:req.params.id,comment:found})
})
})

app.put("/campgrounds/:id/comments/:comment_id",checkcmnt,(req,res)=>{

Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,update)=>{

if(err){
  res.redirect("back")
}
else{
  req.flash("success","Comment Updated!")
  res.redirect("/campgrounds/"+req.params.id)
}


})

})

app.delete("/campgrounds/:id/comments/:comment_id",checkcmnt,(req,res)=>{
  Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
if(err){
  req.flash("success","Comment deleted!")
  res.redirect("back")
}
else{


  res.redirect("/campgrounds/"+req.params.id)
}
  })
})

//middleware


function checkcmnt(req,res,next){
  if(req.isAuthenticated())
    {
      Comment.findById(req.params.comment_id,(err,found)=>{
        if(err){
          req.flash("error","Campground not found")
          res.redirect("back")
        }
        else{
          if(found.author.id.equals(req.user._id)){
next()  }else{
    req.flash("error","Permission Denied!")
    res.redirect("back")

  }}
      })

    }else {
      req.flash("error","You don't have permission to do that!")

    res.redirect("back")
    }

}


function check(req,res,next){

  if(req.isAuthenticated())
    {
      Campground.findById(req.params.id,(err,found)=>{
        if(err){
          res.redirect("back")
        }
        else{
          if(found.author.id.equals(req.user._id)){
next()  }else{    req.flash("error","You don't have permission to do that!")

    res.redirect("back")
  }}
      })

    }else {  req.flash("error","Permission Denied!")
    res.redirect("back")
    }


}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  req.flash("error","You Need To Be Logged In To Do That!")
  res.redirect("/login")
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
