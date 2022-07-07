//modules
const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');


//app init
const app = express();
app.set("view engine","ejs");
app.use(bp.urlencoded({extended:true}))
app.use(express.static("public"));

//mongoose connect
mongoose.connect("mongodb://localhost:27017/todolistDB")


//used schemas
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const listSchema = {
    name: {
        type: String,
        required: true
    },
    items: [itemsSchema]
}

//create models
const List = mongoose.model("List",listSchema);
const Item = mongoose.model("Item",itemsSchema);


//default items
const go_to_work = new Item({
    name: "Go to Work"
})
const do_training = new Item({
    name: "Do training"
})
const default_items = [go_to_work, do_training]

//home page, main list
app.get("/",(req,res)=>{
    Item.find({},(err,items)=>{
        if(err){
            console.log(err);
        }else{
          if(items.length===0){
            Item.insertMany(default_items,(err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("Success!");
                }
            })
            res.render("list",{listTitle: "Today",listItems:default_items})
          }
          else{
            res.render("list",{listTitle: "Today",listItems:items})
          }
           
        }
    })
})

//post request for '/'
app.post("/",(req,res)=>{
    const new_item = req.body.listItem;
    const listName = req.body.listName;

    const item = new Item({
        name:new_item
    })
    
    if(listName!="Today"){
        List.findOneAndUpdate({name:listName},{ $push: { items: item }},(err,foundList)=>{
            if(err){
                console.log(err);
            }
        })
        res.redirect("/"+listName);
    }else{
        item.save();
        res.redirect("/");
    }
    
})

//delete item when checkbox is on
app.post("/delete",(req,res)=>{
    const checkedBox_id = req.body.checkedBox;
    const listName = req.body.listName;

    if(listName==="Today"){
        Item.deleteOne({_id:checkedBox_id},(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Successufuly deleted!")
            }
        })
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name:listName},{ $pull: { items: {_id: checkedBox_id} }},(err,foundList)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect("/"+listName);
            }
        })
        
    }
    
})

//create custom list
app.get("/:customListName",(req,res)=>{
    const customListname = _.capitalize(req.params.customListName);
    List.findOne({name:customListname},(err,foundList)=>{
        if(!err){
            if(!foundList){
                //Create a new list
                const list = new List({
                    name: customListname,
                    items: [go_to_work,do_training]
                })
                list.save();
                res.render("list",{listTitle: customListname,listItems:list.items})
            }else{
                //Show an existing list
                res.render("list",{listTitle: customListname,listItems:foundList.items})
            }
        }
    })
    
})

//listen host 3000
app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
})