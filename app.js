//const array can push new members, but we can't assigned some new array to the const array, same for objects
const express = require("express");
const bp = require("body-parser");
const date = require(__dirname+"/date.js")

const app = express();
const items = ["Eat","Cook"];
const workItems = [];

app.set("view engine","ejs");
app.use(bp.urlencoded({extended:true}))
app.use(express.static("public"));


app.get("/",(req,res)=>{
    let day = date.getDay();
    res.render("list",{listTitle: day,listItems:items})
})

app.post("/",(req,res)=>{
    let item = req.body.listItem;
    console.log(req.body)
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work")
    }
    else{
        items.push(item)
        res.redirect("/");
    }
    
    
})


app.get("/work",(req,res)=>{

    res.render("list",{listTitle: "Work list:",listItems:workItems})
})

app.post("/work",(req,res)=>{
    let item = req.body.listItem;
    workItems.push(item);
    res.redirect("/work");
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
})