//import express from 'express';
//import cors from 'cors';

const express = require('express');
const cors = require('cors');


const app=express();
app.use(cors());
app.use(express.json());

// Get Time
app.get('/getDateTime', (req, res) => {
const currentDateTime = new Date();
const ctTime = currentDateTime.toLocaleString('en-US', {timeZone: 'America/Chicago'});
res.json({dateTime: ctTime});
})

app.get('/', (req, res) => {
    res.redirect('/getDateTime');
});

app.listen(3002, () =>{
console.log("on port 3002");
});