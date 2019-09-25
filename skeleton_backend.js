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
* POST endpoints 
*/ 

/* 
*   Client signing up for se7en
*
*   Below is a sample JSON input:
*       {'user_id' : '1', 
*        'name' : 'Julia Rubin', 
*        'email' : 'email@gmail.com', 
*        'password' : 'password123',}
*/
app.post('\create_user', (req,res) => {
    db.collection("users").insertOne(
        {"user_id":req.body.user_id, 
         "name":req.body.name, 
         "email":req.body.email, 
         "password":req.body.password}, (err, result) => {
    /*
    * TODO: implement error checking
    */
    if (0){
        res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
        return;
    }
        if (err) return console.log(err);
        res.send("User has been added");
    })
})

/* 
*   Send a calendar event to the backend
*   Expect incoming data to be in JSON format
*   Below is a sample JSON input:
*
*       {'time_start' : '23:00', 
*        'time_end' : '24:00', 
*        'date' : ['1', '3', '5'],  
*        'subject' : 'CPEN', 
*        'course_number' : '321',
*        'location' : 'MCLD'}
*/
app.post('\events\{event_id}', (req,res) => {
    db.collection("events").insertOne(
               {'time_start' : req.body.time_start, 
                'time_end' : req.body.time_end, 
                'date' : req.body.date,  
                'subject' : req.body.subject, 
                'course_number' : req.body.course_number,
                'location' : req.body.location},(err, result) => {
    /*
    * TODO: implement error checking
    */
    if (0){
        res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
        return;
    }
        if (err) return console.log(err);
        res.send("User has been added");
    })
})

/*
* PUT endpoints 
*/ 

/* 
*   Add a friend
*   Expect incoming data to be in JSON format
*   Below is a sample JSON input:
*
*       {'friend_id' : '2'}
*/
app.put('\add_friend\{user_id}\{friend_id}', (req,res) => {
    db.collection("users\{user_id}").updateOne({$push:{"friends":req.body.friend_id}}, (err, result) => { // idk
        /*
        * Example of error checking
        */
    if (0){
        res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
        return;
    }
        if (err) return console.log(err);
        res.send("Friend has been added");
    })
})

/*
* GET endpoints 
*/ 

/*
* DELETE endpoints 
*/ 