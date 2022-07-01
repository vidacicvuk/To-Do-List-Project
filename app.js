const express = require("express");
const bp = require("body-parser");

const app = express();

app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.send("Server is running!");
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
})