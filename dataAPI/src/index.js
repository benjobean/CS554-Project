import express from 'express';
import mongoose from 'mongoose';

const app=express();
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/myDatabase", {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

//Schema
const base={
    id: String,
    name: String,
    description: String
};
const monmodel=mongoose.model("FIRSTCOLLECTION", base);

//POST

app.post("/createRecord", async(req, res)=>{
    console.log("inside post function");

    const data=new monmodel({
        name: req.body.name,
        id: req.body.id,
        description: req.body.description
    })
    const val=await data.save();
    console.log("data saved");
    res.json(val);
}, (err)=>{
    console.log("request failed");
    console.log(err);
})

app.get("/getAll", async(req, res)=>{
    console.log("inside getAll function");

    const val=await monmodel.find({});

    console.log("data retrived");
    res.json(val);
}, (err)=>{
    console.log("request failed");
    console.log(err);
})

app.listen(3001, ()=>{
    console.log("on port 3001");
});
