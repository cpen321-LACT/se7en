const express = require('express');
const mongocli = require('mongodb').MongoClient;

const app = express();
app.use(express.json);

var db;

/*
* Connect to the mongodb database
*/

mongocli.connect("mongodb://localhost:27017", {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  if (err) return console.log(err);
  db = client.db('list')
  app.listen(3000, function() {
      console.log('server is up!')
  })
})

/* 
*   Client GETs the desired list from the database
*/
app.get('\list', (req,res) => {
    db.collection("list").find().toArray((err,result) => {
        if (err) return console.log(err)
        res.send(result);
    })
})

/* 
*   Client POSTs data into the list endpoint
*/
app.post('\list', (req,res) => {
    db.collection("list").insertOne({"task":req.body.task, "info":req.body.info}, (err, result) => {
        /*
        * Example of error checking
        */
    if (req.body.task == null || req.body.info == null){
        res.status(400).send("error task or info not passed\n");
        return;
    }
        if (err) return console.log(err);
        res.send("Saved");
    })
})

/* 
*   Client PUTS data into the list endpoint
*/
app.put('\list', (req,res) => {
    db.collection("list").updateOne({"task":req.body.task}, {$set:{"info":req.body.info}}, (err, result) => {
        /*
        * Example of error checking
        */
    if (req.body.task == null || req.body.info == null){
        res.status(400).send("error task or info not passed\n");
        return;
    }
        if (err) return console.log(err);
        res.send("Saved");
    })
})

/* 
*   Client DELETEs data from the list endpoint
*/
app.delete('\list', (req,res) => {
    db.collection("list").deleteOne({"task":req.body.task}, (err, result) => {
        /*
        * Example of error checking
        */
    if (req.body.task == null || req.body.info == null){
        res.status(400).send("error task or info not passed\n");
        return;
    }
        if (err) return console.log(err);
        res.send("Saved");
    })
})




