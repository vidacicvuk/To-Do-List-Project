const express = require("express");
const bp = require("body-parser");
const { application } = require("express");

const app = express();
let items = ["Eat","Cook"];
let workItems = [];

app.set("view engine","ejs");
app.use(bp.urlencoded({extended:true}))
app.use(express.static("public"));


app.get("/",(req,res)=>{
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day=today.toLocaleDateString("en-US",options)
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