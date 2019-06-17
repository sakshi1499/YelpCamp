const mongoose=require('mongoose')

const Campground=require("./models/campground")


const Comment=require("./models/comment")
var data=[
  {
    name:"cougar photobomb",image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },{
    name:"cougar photobomb",image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  }
]


//Remove

function seedDB(){

  Campground.remove({},(err)=>{
//     if(err)
//     console.log(err);
//   })
//
//
// data.forEach(function(seed){
//
//   Campground.create(seed,(err,campground)=>{
//     if(err)
//     console.log(err);
//     else
//     console.log("added");
//
// //comment--
//
//
// Comment.create({text:"I wish there is active internet connection",
// author:"abc"},(err,comment)=>{
//   if(err)
//   console.log(err);
//   else
//   {campground.comments.push(comment)
//   campground.save()}
// })
//
//   })
//
// })
})
}
module.exports=seedDB

//ADD
