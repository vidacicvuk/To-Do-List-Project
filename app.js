const express = require("express");
const bp = require("body-parser");
const { application } = require("express");

const app = express();
var items = ["Eat","Cook"];

app.set("view engine","ejs");
app.use(bp.urlencoded({extended:true}))
app.use(express.static("public"));

app.get("/",(req,res)=>{
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day=today.toLocaleDateString("en-US",options)
    res.render("list",{day: day,listItems:items})
})

app.post("/",(req,res)=>{
    items.push(req.body.listItem)
    res.redirect("/");
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
})