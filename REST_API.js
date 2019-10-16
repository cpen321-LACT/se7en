const express = require('express');
const mongocli = require('mongodb').MongoClient;

const app = express();
app.use(express.json());

var user_db;
var schedule_db;


/*
* Connect to the mongodb database
*/

mongocli.connect("mongodb://localhost:27017", {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  if (err) return console.log(err);

  user_db = client.db('user_db') 
  schedule_db = client.db('schedule_db') 

  /* User Database */
  user_db.createCollection("info_clt", function(err, res) { 
    if (err) throw err;
    console.log("Info collection created!");
  });
  user_db.createCollection("preferences_clt", function(err, res) { 
    if (err) throw err;
    console.log("Peferences collection created!");
  });
  user_db.createCollection("matches_clt", function(err, res) { 
    if (err) throw err;
    console.log("Matches collection created!");
  });

  /* Schedule Database */
  schedule_db.createCollection("schedule_clt", function(err, res) { 
    if (err) throw err;
    console.log("Schedule collection created!");
  });


  app.listen(3000, function() {
      console.log('server is up!')
  })
})

/*---------------------------- Preferences Collection ---------------------------- */

/*
 * Post the preferences of the user with user_id.
 * 
 * TODO: Write error checking code.
 * TESTED: Works
 */
app.post('/user/preferences', (req,res) => {
    user_db.collection("preferences_clt").insertOne(
        {'user_id' : req.body.user_id, 
         'kindness' : req.body.kindness, 
         'patience' : req.body.patience,  
         'hard_working' : req.body.hard_working, 
         'courses' : req.body.courses, 
         'sex' : req.body.sex, 
         'year_level' : req.body.year_level},(err, result) => {
    if (0){
     res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
     return;
    }
     if (err) return console.log(err);
     res.send("Preferences have been added. ٩(^ᴗ^)۶\n");
    })
})

/*
 * Get the preferences of the user with user_id.
 *
 * Below is a sample JSON output:
 * 
 * {'user_id' : 0, 
 *  'kindness' : 2, 
 *  'patience' : 6,
 *  'hard_working' : 4, 
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...], 
 *  'sex' : ['Male', 'Female'],
 *  'year_level' : [3, 4, ...]}
 * 
 * TODO: Write error checking code.
 * TESTED: Works
 */
app.get('/user/:user_id/preferences', (req,res) => {
    user_db.collection("preferences_clt").find({user_id : parseInt(req.params.user_id)}).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    })
})

/*
 * Update the preferences of the user with user_id.
 * 
 * TODO: Write error checking code.
 * TESTED: Works
 */
app.put('/user/:user_id/preferences', (req,res) => {
    var query = {"user_id" : parseInt(req.body.user_id)};
    var newValues = {$set: req.body}; 
    user_db.collection("preferences_clt").updateOne(query, newValues,(err, result) => {
    if (req.body == null){
     res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
     return;
    }
     if (err) return console.log(err);
     res.send("Preferences have been updated. ٩(^ᴗ^)۶\n");
    })
})

/*---------------------------- Info Collection ---------------------------- */

/*
 * Get the user with user_id's information.
 *
 * Below is a sample JSON output:
 * 
 * {'year_level' : 3, 
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...], 
 *  'sex' : 'Male',
 *  'number_of_ratings' : 15, 
 *  'kindness_rating' : 3.4, 
 *  'patience_rating' : 7.6,
 *  'hard_working_rating' : 1.0,
 *  'authentication_token' : ‘abcdef123456789’,
 *  'password' : ‘johndoe@123’,
 *  'user_id' : ‘0’,
 *  'email' : ‘john.doe@gmail.com’,
 *  'name' : 'John Doe'}
 * 
 * TESTED: Works
 */
app.get('/user/:user_id/info', (req,res) => {
    user_db.collection("info_clt").find({ user_id : parseInt(req.params.user_id)}).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    })
})

/*
 * Sign up a new user. Also initialize thier matches to no one.
 * 
 * TESTED : Works
 */
app.post('/user', (req,res) => {
    console.log(req.body)
    user_db.collection("info_clt").insertOne(
        {"year_level" : req.body.year_level, 
         "sex" : req.body.sex, 
         "number_of_ratings" : req.body.number_of_ratings,  
         "kindness_rating" : req.body.kindness_rating, 
         "patience_rating" : req.body.patience_rating,
         "hard_working_rating" : req.body.hard_working_rating,
         "authentication_token" : req.body.authentication_token,
         "password" : req.body.password,
         "user_id" : req.body.user_id,
         "email" : req.body.email,
         "name" : req.body.name},(err, result) => {
    if (req.body.year_level == null){
     res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
     return;
    }
     if (err) return console.log(err);
        res.send("error");
    })
   //res.send("done");
    console.log("after insert")
    /*
    user_db.collection("matches_clt").insertOne(
        {'user_id' : req.body.user_id, 
         'potential_matches' : [], 
         'user_is_waiting_to_match_with' : [],  
         'currently_matched_with' : []},(err, result) => {

     if (err) return console.log(err);
     //res.send("User matches initialization success.\n");
    })
    */
})

/*
 * Update the information of user with user_id's information.
 * 
 * TESTED : Works
 */
app.put('/user/info', (req,res) => {
    if (req.body == null){
        console.log("(┛ಠ_ಠ)┛彡┻━┻\n");
        return;
       }
    console.log("hai")
    var query = {user_id : req.body.user_id};
    var newValues = {$set: {year_level : req.body.year_level, 
                            sex : req.body.sex, 
                            number_of_ratings : req.body.number_of_ratings,  
                            kindness_rating : req.body.kindness_rating, 
                            patience_rating : req.body.patience_rating,
                            hard_working_rating : req.body.hard_working_rating,
                            authentication_token : req.body.authentication_token,
                            password : req.body.password,
                            user_id : req.body.user_id,
                            email : req.body.email,
                            name : req.body.name}}; 
    user_db.collection("info_clt").updateOne(query, newValues,(err, result) => {
    if (req.body == null){
     res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
     return;
    }
     if (err) return console.log(err);
     res.send("User info has been updated.\n");
    })
})

/*---------------------------- Matches Collection ---------------------------- */

/*
 * Get a sorted list of the user with user_id's potential, 
 * waiting and current matches.
 *
 * Below is a sample JSON output:
 *  {'user_id’: ‘0’,
 *  'potential_matches' : [‘user_id_0’, ‘user_id_1’, ‘user_id_2’,...],
 *  'user_is_waiting_to_match_with' : [‘user_id_3’, ‘user_id_4’,...],
 *  'currently_matched_with’ : [‘user_id_5’, ‘user_id_6’,...]} 
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function.
 * TODO: Test
 */
app.get('/user/:user_id/matches', (req,res) => {

    /* TODO: implement complex logic */

    user_db.collection("info_clt").find({}, {projection : {"user_id" : req.body.user_id}}).toArray((err, result) => {
        if (err) return console.log(err);

        //res.send(result);
    })
})

/*
 * Match user with user_id user_id_a with user with user_id user_id_b and vice versa.
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 * TODO: Test
 */
app.put('/user/:user_id_a/matches/:user_id_b', (req,res) => {
})

/*
 * Unmatch user with user_id with user with match_id and vice versa.
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function.
 * TODO: Test
 */
app.delete('/user/{user_id}/matches/{match_id}', (req,res) => {
})


/*---------------------------- Schedule Collection ---------------------------- */


/*
 * Get the user with user_id's schedule at a specific time.
 *
 * Below is a sample JSON output:
 * 
 * { ‘user_id’ : 0, 
 *   'time' : '13:00 - 14:00', 
 *   'date' : 'Oct. 4, 2019'
 *   'subject' : 'CPEN 321', 
 *   'location' : 'Irving K. Barber'}
 * 
 * TODO: Write error checking code.
 * Tested: Works
 */
app.get('/schedule/:user_id/single_time', (req,res) => {
    var query = {time : req.body.time, date: req.body.date, user_id : parseInt(req.body.user_id)};
    schedule_db.collection("schedule_clt").find(query).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    })
})

/*
 * Get the user with user_id's whole schedule.
 *
 * Below is a sample JSON output:
 * 
 * { ‘user_id’ : 0, 
 *   'time' : '13:00 - 14:00', 
 *   'date' : 'Oct. 4, 2019'
 *   'subject' : 'CPEN 321', 
 *   'location' : 'Irving K. Barber'}
 * 
 * TODO: Write error checking code.
 * Tested: Works
 */
app.get('/schedule/:user_id', (req,res) => {
    var query = {user_id : parseInt(req.params.user_id)};
    schedule_db.collection("schedule_clt").find(query).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    })
})

/*
 * Add an event the schedule of the user with with user_id.
 * 
 * TODO: Write error checking code.
 * Tested: Works
 */
app.post('/schedule', (req,res) => {
    schedule_db.collection("schedule_clt").insertOne(
        {'user_id' : req.body.user_id, 
         'time' : req.body.time, 
         'date' : req.body.date,  
         'subject' : req.body.subject, 
         'location' : req.body.location},(err, result) => {
    if (0){
     res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
     return;
    }
     if (err) return console.log(err);
     res.send("Schedule has been posted.\n");
    })
})

/*
 * Update the schedule of the user with with user_id.
 * 
 * TODO: Write error checking code.
 * TODO: Test
 * TODO: Talk about this function
 */
app.put('/schedule/:user_id', (req,res) => {
    var query = {"user_id" : req.body.user_id};
    var newValues = {$set: req.body}; 
    schedule_db.collection("schedule_clt").updateOne(query, newValues,(err, result) => {
    if (req.body == null){
     res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
     return;
    }
     if (err) return console.log(err);
     res.send("Schedules have been updated.\n");
    })
})

/*
 * Delete the whole schedule  
 * !! We will need to find a way to differentiate between study events. !!
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 * Tested: Works
 */
app.delete('/user/:user_id/schedule', (req,res) => {
    var query = {"user_id" : parseInt(req.params.user_id)};
    console.log(parseInt(req.params.user_id));
    schedule_db.collection("schedule_clt").deleteOne(query, (err, result) => {
        if (err) return console.log(err);
        res.send("deleted the schedule\n");
    })
})

/*
 * Delete a study event with event_id of the user with user_id. 
 * !! We will need to find a way to differentiate between study events. !!
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 * TODO: Test
 * TODO: Talk about this function
 */
app.delete('/user/:user_id/schedule/single_delete', (req,res) => {
    var query = {"user_id" : req.body.user_id, "time" : req.body.time, "date" : req.body.date};
    schedule_db.collection("schedule_clt").deleteOne(query, (err, result) => {
        if (err) return console.log(err);
        res.send("deleted the specific time\n");
    })
})
