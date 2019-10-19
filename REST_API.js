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
        res.send("goi it");
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
app.get('/user/:user_id/matches/potential_matches', (req,res) => {

    /* TODO: implement complex logic */
    /*_________________________________________________________
     * Get the infor array of standard vars from the user_id 
     *_________________________________________________________ */
    var query = {"year_level" : req.body.year_level, 
                 "courses" : req.body.courses,
                 "sex" : req.body.sex,
                 "name" : req.body.name };
    /* Filter all standard criteria to an array */
    user_db.collection("info_clt").find(query).toArray((err,infor_array) => {
        if (err) return console.log(err); })
     
    /*_________________________________________________________
     * Get the schedule array of specific time 
     *_________________________________________________________ */
    var query = {"time" : req.body.time, 
                 "date" : req.body.date};
    /* Filter all standard time to an array */
    schedule_db.collection("schedule_clt").find(query).toArray((err,schedule_array) => {
        if (err) return console.log(err); })

    /*_________________________________________________________
     * Call the time-filter function
     * Call for the function generateMatch which sort all the matches
     * and return an array "ret" of potential matches and put that into the database
     *_________________________________________________________ */
    var std_match_array = time_filter_match(infor_array, schedule_array);   
    var ret = generateMatch(req.body.kindness, req.body.hard_working, req.body.patience, std_match_array);

    var query = {"user_id" : parseInt(req.body.user_id),
                 "time" : req.body.time, 
                 "date" : req.body.date};
    var newValues = {$set:{'potential_matches' : ret}}; 
    user_db.collection("matchs_clt").updateOne(query, newValues,(err, result) => {
        if(req.body == null){
        res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
        return;}
    })    
    /* Return the potential match array */
    user_db.collection("match_clt").find(query).toArray((err,result) => {
        if (err) return console.log(err);
        /* return the potential matches */
        res.send(result);
    })
})


/*
 *  A helper function used for sorting algorithm 
 */
function generateMatch(kindness, hard_working, patience, array){
    var score = [[],[]];
    for(var i = 0; i < array.length; i++){
        score[i][0] =   Math.abs(kindness - array[i].kindness) +
                        Math.abs(hard_working - array[i].hard_working) +
                        Math.abs(patience - array[i].patience);
        score[i][1] =   array[i].user_id;
    }
    /* Do insertion sort */
    for(var i = 0; i < array.length; i++){
        var sc = score[i][0];
        var id = score[i][1];
        var j = i;
        while(j>0 && score[j-1][0] > sc){
            score[j][0] = score[j-1][0];
            score[j][1] = score[j-1][1];
            j--;
        }
        score[j][0] = sc;
        score[j][1] = id; 
    }
    var ret = [];
    for(var i = 0; i < array.length; i++){
       ret[i] = score[i][1];
    }

    return ret;
}
/* A helper function that filters the array by the time, dat */
function time_filter_match(infor_array, schedule_array){
    var i = 0;
    while(i < infor_array.length){
        var infor = infor_array[i];
        for(var j = 0; j < schedule_array.length; j++){
            if(infor.user_id == schedule_array[j].user_id){
                i++;
                break;
            }
        }
        infor_array.splice(i,1);
    }
}


/*
 * Match user with user_id user_id_a with user with user_id user_id_b.
 *
 * Update currently_matched_with array for user_a and user_b
 * 
 * { "time" : "12:00-1:00", "date" : "Oct. 3, 2019"}
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 * TODO: Test
 */
app.put('/user/:user_id_a/matches/:user_id_b', (req,res) => {
    var query_user_a = { user_id : parseInt(req.params.user_id_a), "time" : req.body.time, "date" : req.body.date};
    var query_user_b = { user_id : parseInt(req.params.user_id_b), "time" : req.body.time, "date" : req.body.date};

    console.log(query_user_a)


    var user_a_match_doc;
    var user_b_match_doc;

    /* Get user_a's match document for a specific time and date */
    user_db.collection("matches_clt").find(query_user_a).toArray((err, a) => {
        if (err) return console.log(err);
        user_a_match_doc = a;
    })
    console.log(user_a_match_doc)
    /* Get user_b's match document for a specific time and date */
    user_db.collection("matches_clt").find(query_user_b).toArray((err, b) => {
        if (err) return console.log(err);
        user_b_match_doc = b;
    })

    console.log("User a's match document before update:\n");
    console.log(user_a_match_doc)
    console.log('\n')

    console.log("User b's match document before update:\n");
    console.log(user_b_match_doc)
    console.log('\n')

    /* If user_b has already requested to match with user_a */
    if (user_b_match_doc['request'].includes(parseInt(req.params.user_id_a))) {
        
        console.log("user_b has already requested to match with user_a\n")
        console.log(user_a_match_doc['match'])
        console.log('\n')
        console.log(user_b_match_doc['match'])
        console.log('\n')

        /* user_b is user_a's match */
        user_a_match_doc['match'] = parseInt(req.params.user_id_b);
        /* user_a to user_b's match */
        user_b_match_doc['match'] = parseInt(req.params.user_id_a);

        /* if user_a was waiting for user_b, remove user_b from wait list */
        if (user_a_match_doc['wait'].includes(parseInt(req.params.user_id_b))){
            user_a_match_doc['wait'].splice(array.indexOf(parseInt(req.params.user_id_b)), 1)
            console.log("user_a was waiting for user_b, remove user_b from wait list\n")
        }
    }
    else {
        console.log("Adding user_a to user_b's request list:\n");
        /* user_a has requested to match with user_b*/
        user_b_match_doc['request'].append(parseInt(req.params.user_id_a));
        console.log(user_b_match_doc['request'])
        console.log('\n')

        console.log("Adding user_b to user_a's wait list:\n");
        /* user_a is waiting to match with user_b */
        user_a_match_doc['wait'].append(parseInt(req.params.user_id_b));
        console.log(user_a_match_doc['wait'])
        console.log('\n')
    }

    /* Update user_a's matches */
    user_db.collection("matches_clt").updateOne(query_user_a, user_a_match_doc).toArray((err, update_result_a) => {
        if (err) return console.log(err);
    })
    /* Update user_b's matches */
    user_db.collection("matches_clt").updateOne(query_user_a, user_b_match_doc).toArray((err, update_result_b) => {
        if (err) return console.log(err);
    })

    console.log("User a's match document after update:\n");
    console.log(user_a_match_doc)
    console.log('\n')

    console.log("User b's match document after update:\n");
    console.log(user_b_match_doc)
    console.log('\n')

    res.send("Successfully added matches.");
})

/*
 * Get who the user is currently matched with
 * TODO: Test
 */
app.get('/user/:user_id/matches/currently_matched_with', (req,res) => {
    var cur_matches = [];
    var i;
    /* Find all the match documents for a specified user */
    user_db.collection("matches_clt").find({ user_id : parseInt(req.params.user_id)}).toArray((err, matches) => {
        if (err) return console.log(err);
        /* Generate the current matches */
        for (i = 0; i < matches.length-1; i++){
            /* if the user has a match */
            if (matches[i]['match'] != null) { 
                /* Add the match to the list */
                cur_matches.append(
                    {'time' : matches[i]['time'], 
                    'date' : matches[i]['date'], 
                    'match' : matches[i]['match']})
            }
        }
        /* Return JSON object*/
        res.send({'current_matches' : cur_matches})
    })
})

/*
 * Get who the user is waiting to match with
 * TODO: Test
 */
app.get('/user/:user_id/matches/user_is_waiting_to_match_with', (req,res) => {
    user_db.collection("matches_clt").find({ user_id : parseInt(req.params.user_id)}).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result['wait']);
    })
})



/*
 * Unmatch user with user_id with user with match_id and vice versa.
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function.
 * TODO: Test
 */
app.delete('/user/:user_id/matches/:match_id', (req,res) => {
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
    /* Create schedule object */
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
     console.log('schedule added')
    })
    /* Create a match object for that schedule */
    user_db.collection("matches_clt").insertOne(
        {'user_id' : req.body.user_id, 
         'time' : req.body.time, 
         'date' : req.body.date,  
         'wait' : [],
         'request' : [],
         'match' : null},(err, result) => {
    if (0){
     res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
     return;
    }
     if (err) return console.log(err);
     console.log('matches document init done')
     res.send("Schedule has been posted")
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

/* 
 * 1) Create user_a - user_id = 0
 * 2) Create user_b - user_id = 1
 * 3) Create a schedule event for user_a
 * 4) Create a schedule event for user_b
 * 5) Match user_a and user_b
 * 
 * 
 * 
 * 
 * 
 * 
 */
