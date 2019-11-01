const express = require('express');
const mongocli = require('mongodb').MongoClient;

const app = express();
app.use(express.json());

var user_db;
var schedule_db;

var doesntExist = function(obj) {
    return Object.keys(obj).length === 0;
}

var isAcceptablePreferences = function(a,b,c) {
    return a + b + c == 12;
}

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
 * Will return an error if...
 * - the user does not exist in the database
 * - the sum of kindness, patience and hard_working does not equal 12
 * - you send a sex that is not in range
 */
app.post('/user/:user_id/preferences', (req,res) => {

    var user_query = {user_id : parseInt(req.params.user_id)};

    /* Check if the user exists in the database */
    user_db.collection("info_clt").find(user_query).toArray((err, user) => {

        if (doesntExist(user)){
            res.status(400).send("You are posting user preferences for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }

        if (doesntExist(req.body)){
            res.status(400).send("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        } 

        if (!isAcceptablePreferences(parseFloat(req.body.kindness), parseFloat(req.body.patience), parseFloat(req.body.hard_working)) ){
            res.status(400).send("kindness, patience and hard_working do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }

        if (parseInt(req.body.sex) < 0 || parseInt(req.body.sex) > 2) {
            res.status(400).send("THERE ARE ONLY 3 SEXES (FOR PREFERENCES) (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }

        /* Add the users preferences */
        user_db.collection("preferences_clt").insertOne(
            {'user_id'      : parseInt(req.params.user_id),
             'kindness'     : parseFloat(req.body.kindness),
             'patience'     : parseFloat(req.body.patience),
             'hard_working' : parseFloat(req.body.hard_working),
             'courses'      : req.body.courses,
             'sex'          : parseInt(req.body.sex),
             'year_level'   : req.body.year_level},(err, result) => {
         if (err) return console.log(err);
         res.status(200).send("Preferences have been added. ٩(^ᴗ^)۶\n");
        })  
    })
})

/*
 * Get the preferences of the user with user_id.
 *
 * Below is a sample JSON output:
 *
 * {'user_id' : 0,
 *  'kindness' : 2.0,
 *  'patience' : 6.0,
 *  'hard_working' : 4.0,
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
 *  'sex' : 1,
 *  'year_level' : [3, 4, ...]}
 */
app.get('/user/:user_id/preferences', (req,res) => {

    var user_query = {user_id : parseInt(req.params.user_id)};

    user_db.collection("preferences_clt").find(user_query).toArray((err, user) => {
        if (doesntExist(user)){
            res.status(400).send("You are trying to GET preferences of a user that doesn't exist in the database (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        } else {
            res.send(user);
        }
    })
})

/*
 * Update the preferences of the user with user_id.
 *
 * Below is a sample JSON input:
 *
 * {'kindness' : 2,
 *  'patience' : 6,
 *  'hard_working' : 4,
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
 *  'sex' : 0,
 *  'year_level' : [3, 4, ...]}
 */
app.put('/user/:user_id/preferences', (req,res) => {
    var user_query = {"user_id" : parseInt(req.params.user_id)};
    var newValues = {$set: req.body};

    /* Check if the user exists in the database */
    user_db.collection("info_clt").find(user_query).toArray((err, user) => {

        if (doesntExist(req.body)){
            res.status(400).send("you sent a null body (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }

        if (doesntExist(user)){
            res.status(400).send("You are updating user preferences for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }

        if (!isAcceptablePreferences(parseFloat(req.body.kindness), parseFloat(req.body.patience), parseFloat(req.body.hard_working)) ){
            res.status(400).send("kindness, patience and hard_working do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }

        /* No errors, update the user preferences */
        user_db.collection("preferences_clt").updateOne(user_query, newValues,(err, result) => {
            if (err) return console.log(err);
            res.send("Preferences have been updated. ٩(^ᴗ^)۶\n");
        })
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
 *  'sex' : 0,
 *  'number_of_ratings' : 15,
 *  'kindness' : 3.4,
 *  'patience' : 7.6,
 *  'hard_working' : 1.0,
 *  'authentication_token' : ‘abcdef123456789’,
 *  'password' : ‘johndoe@123’,
 *  'user_id' : 0,
 *  'email' : ‘john.doe@gmail.com’,
 *  'name' : 'John Doe'}
 */
app.get('/user/:user_id/info', (req,res) => {
    user_db.collection("info_clt").find({ user_id : parseInt(req.params.user_id)}).toArray((err, user_info) => {
        if (doesntExist(user_info)){
            res.status(400).send("You are trying to get user info for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }
        if (err) return console.log(err);
        res.send(user_info);
    })
})

/*
 * Sign up a new user. Also initialize thier matches to no one.
 *
 * Below is a sample JSON input:
 *
 * {'year_level' : 3,
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
 *  'sex' : 0,
 *  'number_of_ratings' : 15,
 *  'kindness' : 3.4,
 *  'patience' : 7.6,
 *  'hard_working' : 1.0,
 *  'authentication_token' : ‘abcdef123456789’,
 *  'password' : ‘johndoe@123’,
 *  'email' : ‘john.doe@gmail.com’,
 *  'name' : 'John Doe'}
 */
app.post('/user/:user_id', (req,res) => {

    user_db.collection("info_clt").find({ user_id : parseInt(req.params.user_id)}).toArray((err, user_info) => {
        if (user_info != null){
            res.status(400).send("The user with this user_id already exists in the database (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }
        if (doesntExist(req.body)){
            res.status(400).send("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        } 

        if (!isAcceptablePreferences(parseFloat(req.body.kindness), parseFloat(req.body.patience), parseFloat(req.body.hard_working)) ){
            res.status(400).send("kindness, patience and hard_working do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }

        if (parseInt(req.body.sex) < 0 || parseInt(req.body.sex) > 1) {
            res.status(400).send("THERE ARE ONLY 2 SEXES (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }


        user_db.collection("info_clt").insertOne(
            {"year_level"           : req.body.year_level,
             "sex"                  : parseInt(req.body.sex),
             "courses"              : req.body.courses,
             "number_of_ratings"    : parseInt(req.body.number_of_ratings),
             "kindness"             : parseFloat(req.body.kindness),
             "patience"             : parseFloat(req.body.patience),
             "hard_working"         : parseFloat(req.body.hard_working),
             "authentication_token" : req.body.authentication_token,
             "password"             : req.body.password,
             "user_id"              : parseInt(req.params.user_id),
             "email"                : req.body.email,
             "name"                 : req.body.name},(err, result) => {


         if (err) return console.log(err);
            res.send("The user has been added to the database!");
        }) 
    })
})

/*
 * Update the information of user with user_id's information.
 *
 * Below is a sample JSON input:
 *
 * {'year_level' : 3,
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
 *  'sex' : 0,
 *  'number_of_ratings' : 15,
 *  'kindness' : 3.4,
 *  'patience' : 7.6,
 *  'hard_working' : 1.0,
 *  'authentication_token' : ‘abcdef123456789’,
 *  'password' : ‘johndoe@123’,
 *  'user_id' : 0,
 *  'email' : ‘john.doe@gmail.com’,
 *  'name' : 'John Doe'}
 */
app.put('/user/:user_id/info', (req,res) => {
    var query = {user_id : parseInt(req.params.user_id)};
    var newValues = {$set: {year_level           : parseInt(req.body.year_level),
                            sex                  : parseInt(req.body.sex), 
                            courses              : req.body.courses,
                            number_of_ratings    : parseInt(req.body.number_of_ratings),
                            kindness             : parseFloat(req.body.kindness),
                            patience             : parseFloat(req.body.patience),
                            hard_working         : parseFloat(req.body.hard_working),
                            authentication_token : req.body.authentication_token,
                            password             : req.body.password,
                            email                : req.body.email,
                            name                 : req.body.name}};

    user_db.collection("info_clt").find({ user_id : parseInt(req.params.user_id)}).toArray((err, user_info) => {
        if (!doesntExist(user_info)){
            res.status(400).send("The user with this user_id already exists in the database (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }
        if (doesntExist(req.body)){
            res.status(400).send("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        } 

        if (!isAcceptablePreferences(parseFloat(req.body.kindness), parseFloat(req.body.patience), parseFloat(req.body.hard_working)) ){
            res.status(400).send("kindness, patience and hard_working do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }

        if (parseInt(req.body.sex) < 0 || parseInt(req.body.sex) > 1) {
            res.status(400).send("THERE ARE ONLY 2 SEXES (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }

        user_db.collection("info_clt").updateOne(query, newValues,(err, result) => {
             if (err) return console.log(err);
             res.send("The user info has been updated! ヽ(＾Д＾)ﾉ\n");
        })
    })
})

/*
 *  Delete an user - delete all information of that user
 *  This take no arguments
 * 
 *  NOTE: Either
 *  - the front end will call for other delete request for schedule,
 *  preference before calling this
 *  - or this request will have to handle all deletes
 *  ----> Use the former one for now 
 */
app.delete('/user/:user_id/info', (req,res) => {
    var query = {"user_id" : parseInt(req.params.user_id)};
    console.log(parseInt(req.params.user_id));
    schedule_db.collection("info_clt").deleteOne(query, (err, result) => {
        if (err) return console.log(err);
        res.send("deleted the user: ", parseInt(req.params.user_id));
    })
})

/*---------------------------- Matches Collection ---------------------------- */

/*
 * Get a sorted list of the user with user_id's potential,
 * waiting and current matches.
 *
 * Below is a sample JSON input:
 *  {'user_id’: 0,
 *   'year_level' : 3,
 *  'event_id': 2,
 *  'kindness' : 3,
 *  'hard_working' : 3,
 *  'patience' : 6}
 * 
 *  Tung: can you change this so it doesnt require a body to work
 */
app.get('/user/:user_id/matches/potential_matches', (req,res) => {
    /*_________________________________________________________
     * Get the info array of standard vars from the user_id
     *_________________________________________________________ */
    var query = {"year_level" : req.body.year_level,
                 "sex" : req.body.sex};
    /* Filter all standard criteria to an array */
    user_db.collection("info_clt").find(query).toArray((err,infor_array) => {
        if (err) return console.log(err);

        var info = infor_array;

    var time_date_query = {"user_id" : parseInt(req.body.user_id),
                           "event_id" : parseInt(req.body.event_id)};

    schedule_db.collection("schedule_clt").find(time_date_query).toArray((err, user_schedule_event) => {

      if (user_schedule_event[0] == null){
        res.send("There are no users in the database\n")
        return;
      } else {
      var time = user_schedule_event[0].time;
      var date = user_schedule_event[0].date;
    }

    /*_________________________________________________________
     * Get the schedule array of specific time
     *_________________________________________________________ */
    var query = {"time" : time,
                 "date" : date,
                 "course" : req.body.course};

    /* Filter all standard time to an array */
    schedule_db.collection("schedule_clt").find(query).toArray((err,schedule_array) => {
        if (err) return console.log(err);
        /* the user cannot be a potential match of him/herself */
        var schedule = schedule_array;

    /*_________________________________________________________
     * Call the time-filter function
     * Call for the function generateMatch which sort all the matches
     * and return an array "ret" of potential matches and put that into the database
     *_________________________________________________________ */
    var std_match_array = time_filter_match(info, schedule, parseInt(req.body.user_id));

    console.log(req.body.kindness)

    var ret = generateMatch(req.body.kindness, req.body.hard_working, req.body.patience, std_match_array);

    var query = {"user_id" : parseInt(req.body.user_id),
                 "event_id" : parseInt(req.body.event_id)};
    var newValues = {$set:{'potential_matches' : ret}};
    user_db.collection("matches_clt").updateOne(query, newValues,(err, result) => {
        if(req.body == null){
            res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
            return;}
    /* Return the potential match array */
    user_db.collection("matches_clt").find(query).toArray((err,result) => {
        if (err) return console.log(err);
        /* return the potential matches */
        res.send(result);
    }) }) }) }) })
})


/*
 * Match user with user_id user_id_a with user with user_id user_id_b.
 *
 * Update currently_matched_with array for user_a and user_b
 * 
 * Sample JSON input:
 * { "event_id_a : 0, "event_id_b" : 2}
 * Adam: to test
 */
app.post('/user/:user_id_a/matches/:user_id_b', (req,res) => {
    var query_user_a = { user_id : parseInt(req.params.user_id_a), "event_id" : parseInt(req.body.event_id_a)};
    var query_user_b = { user_id : parseInt(req.params.user_id_b), "event_id" : parseInt(req.body.event_id_b)};

    var user_a_match_doc;
    var user_b_match_doc;

    /* Get user_a's match document for a specific time and date */
    user_db.collection("matches_clt").find(query_user_a).toArray((err, a) => {
        if (err) return console.log(err);
        if (doesntExist(a)){
            res.send("User A doesn't exist\n")
            return;
        }
        user_a_match_doc = a[0];

        /* Get user_b's match document for a specific time and date */
        user_db.collection("matches_clt").find(query_user_b).toArray((err, b) => {
            if (err) return console.log(err);
            if (doesntExist(b)){
                res.send("User B doesn't exist\n")
                return;
            }
            user_b_match_doc = b[0];


            /* If user_b has already requested to match with user_a and is waiting */
            if (user_b_match_doc['wait'].includes(parseInt(req.params.user_id_a))) {

                /* user_b is user_a's match */
                user_a_match_doc['match'] = parseInt(req.params.user_id_b);
                /* user_a to user_b's match */
                user_b_match_doc['match'] = parseInt(req.params.user_id_a);

                user_b_match_doc['wait'].splice(user_b_match_doc['wait'].indexOf(parseInt(req.params.user_id_a)), 1)
                user_a_match_doc['request'].splice( user_a_match_doc['request'].indexOf(parseInt(req.params.user_id_b)), 1)

            }
            else {
                /* user_a has requested to match with user_b*/
                user_b_match_doc['request'].push(parseInt(req.params.user_id_a))

                /* user_a is waiting to match with user_b */
                user_a_match_doc['wait'].push(parseInt(req.params.user_id_b));

            }

            /* Update user_a's matches */
            user_db.collection("matches_clt").updateOne(query_user_a, {$set: {match : user_a_match_doc.match, request : user_a_match_doc.request, wait : user_a_match_doc.wait}}, (err, update_result_a) => {
                if (err) return console.log(err);

                    /* Update user_b's matches */
                user_db.collection("matches_clt").updateOne(query_user_b, {$set: {match : user_b_match_doc.match, request : user_b_match_doc.request, wait : user_b_match_doc.wait}}, (err, update_result_b) => {
                    if (err) return console.log(err);

                    res.send("Successfully added matches.");
                })
            })
        })
    })
})

/*
 * Get who the user is currently matched with.
 * Adam: To test
 */
app.get('/user/:user_id/matches/currently_matched_with', (req,res) => {
    var cur_matches = [];
    var i;
    /* Find all the match documents for a specified user */
    user_db.collection("matches_clt").find({ user_id : parseInt(req.params.user_id)}).toArray((err, matches) => {
        if (err) return console.log(err);
        if (doesntExist(matches)){
            res.send("The user with user_id doesnt have any matches\n")
        }
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
 * Adam: To test
 */
app.get('/user/:user_id/matches/user_is_waiting_to_match_with', (req,res) => {
    user_db.collection("matches_clt").find({ user_id : parseInt(req.params.user_id)}).toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result['wait']);
    })
})

/*
 * Unmatch user with user_id with user with match_id and vice versa.
 * This will call helper function person_match_delete()
 * Tung: Can you test this 
 */
app.delete('/user/:user_id/matches/:match_id', (req,res) => {
    var err1 = person_match_delete(req.param.user_id_a, req.body.time, req.body.date);
    var err2 = person_match_delete(req.param.user_id_b, req.body.time, req.body.date);
    if(err1 || err2) return console.log(err);
    res.send("Successfully unmatch.");
})



/*______________________________________________________________________________________
 * Helper funtions used for the match algorithm
 *______________________________________________________________________________________*/

/* A helper function used for sorting algorithm */
function generateMatch(kindness, hard_working, patience, array){

    // Create one dimensional array
    var score = new Array(array.length);

    // Loop to create 2D array using 1D array
    for (var i = 0; i < score.length; i++) {
        score[i] = new Array(2);
    }

    for(var i = 0; i < array.length; i++){
        score[i][0] =   Math.abs(kindness - array[i].kindness) +
                        Math.abs(hard_working - array[i].hard_working) +
                        Math.abs(patience - array[i].patience);
        score[i][1] =   array[i].user_id;
    }
    /* Do insertion sort */
    for(var i = 0; i < array.length; i++){
        var sc = score[i][0]; //score
        var id = score[i][1]; //user_id
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
/* A helper function that filters the array by the time, date */
function time_filter_match(infor_array, schedule_array, user_id){
    var filtered_matches = [];
    for(var i = 0; i < infor_array.length; i++){
        var infor = parseInt(infor_array[i].user_id);
        for(var j = 0; j < schedule_array.length; j++){
            if(infor == parseInt(schedule_array[j].user_id) && infor != user_id){
                filtered_matches.push(infor_array[i]);
            }
        }
    }
    return filtered_matches;
}
/*
 *  Delete the the matching with given time and user_id.
 *  Modify other user_id matches as needed.
 *  This will call for all_request_delete, all_wait_delete, and person_match_delete
 */
function matches_delete(user_id, event_id){
    /* Read the match object into an object */
    query = {"user_id" : user_id,
             "event_id" : event_id}
    user_db.collection("match_clt").find(query).toArray((err,result) => {
        if (err) return console.log(err);
        var matches = JSON_stringify(result);
        var wait = matches.wait;            /* Will later update the request list of people that this person requested */
        var request = matches.request;      /* Delete this list won't affect other people's matches */
        var match_person = matches.match;   /* Will later update the matched person's "match" to NULL  */
        var time = matches.time;
        var date = matches.date;
          /* Delete requests and waits to others */
        all_request_delete(user_id, wait, time, date);
        all_wait_delete(user_id, request, time, date);
          /* Delete the matching person */
        if(match_person != null) person_match_delete(match_person, time, date);

        /* Delete the match object */
        var query = {"user_id" : user_id, "time" : time, "date" : date};
        user_db.collection("schedule_clt").deleteOne(query, (err, result) => {
            if (err) return console.log(err);
        })
    })

}
/* Delete the all the requests that the given user_id sent */
function all_request_delete(user_id, wait, time, date){
    for(var i = 0; i < wait.length; i++){
        var requested_id = wait[i];
        var query = {"user_id" : parseInt(requested_id),
                     "time" : time,
                     "date" : date};
        user_db.collection("match_clt").find(query).toArray((err,result) => {
            if (err) return console.log(err);
            result = JSON.stringify(result);
            var request = result.request;
            /* Find the id and delete it */
            for(var j = 0; j < request.length; j++){
                if(parseInt(request[j]) == pareInt(user_id)){
                    request.splice(j,1);
                    break;
                }
            }
            user_db.collection("matchs_clt").updateOne(query, request,(err, result) => {
                if (err) return console.log(err); })
        })
    }
}
function all_wait_delete(user_id, request, time, date){
    for(var i = 0; i < request.length; i++){
        var waited_id = request[i];
        var query = {"user_id" : parseInt(waited_id),
                     "time" : time,
                     "date" : date};
        user_db.collection("match_clt").find(query).toArray((err,result) => {
            if (err) return console.log(err);
            result = JSON.stringify(result);
            var wait = result.wait;
            /* Find the id and delete it */
            for(var j = 0; j < wait.length; j++){
                if(parseInt(wait[j]) == pareInt(user_id)){
                    wait.splice(j,1);
                    break;
                }
            }
            user_db.collection("matchs_clt").updateOne(query, wait,(err, result) => {
                if (err) return console.log(err); })
        })
    }
}
/* Delete the matching of 2 people */
function person_match_delete(user_id, time, date){
    var query = {"user_id" : parseInt(user_id),
                 "time" : time,
                 "date" : date};
    var newValues = {$set:{'match' : null}};
    user_db.collection("matchs_clt").updateOne(query, newValues,(err, result) => {
        if (err) return 1;
        return 0; })
}
/*______________________________________________________________________________________
 *  End of helper funtions used for the match algorithm
 *______________________________________________________________________________________*/

 app.get('/get_all_users',  (req,res) => {
     user_db.collection("info_clt").find().toArray((err, a) => {
         console.log(a)
         res.send(a)
     })
 })

 app.delete('/delete_all_users',  (req,res) => {
     user_db.collection("info_clt").deleteMany({},(err, a) => {
         console.log(a)
         res.send(a)
     })
 })

app.get('/get_all_schedules',  (req,res) => {
    schedule_db.collection("schedule_clt").find().toArray((err, a) => {
        console.log(a)
        res.send(a)
    })
})

app.get('/get_all_matches',  (req,res) => {
    user_db.collection("matches_clt").find().toArray((err, a) => {
        console.log(a)
        res.send(a)
    })
})


app.delete('/delete_all_schedules',  (req,res) => {
    schedule_db.collection("schedule_clt").deleteMany({},(err, a) => {
        console.log(a)
        res.send(a)
    })
})

app.delete('/delete_all_matches',  (req,res) => {
    user_db.collection("matches_clt").deleteMany({},(err, a) => {
        console.log(a)
        res.send(a)
    })
})


/*---------------------------- Schedule Collection ---------------------------- */


/*
 * Get the user with user_id's schedule at a specific study event.
 *
 * Below is a sample JSON output:
 *
 * { ‘user_id’ : 0,
 *   'event_id' : 0,
 *   'time' : '13:00 - 14:00',
 *   'date' : 'Oct. 4, 2019'
 *   'course' : 'CPEN 321',
 *   'location' : 'Irving K. Barber'}
 */
app.get('/schedule/:user_id/:event_id', (req,res) => {
    var query = {event_id : parseInt(req.body.event_id), user_id : parseInt(req.params.user_id)};

    schedule_db.collection("schedule_clt").find(query).toArray((err, result) => {
        if (doesntExist(result)){
            res.send("The study event with event_id for user with user_id doesn't exist\n")
            return;
        }
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
 *   'event_id' : 0,
 *   'time' : '13:00 - 14:00',
 *   'date' : 'Oct. 4, 2019'
 *   'course' : 'CPEN 321',
 *   'location' : 'Irving K. Barber'}
 */
app.get('/schedule/:user_id', (req,res) => {
    var query = {user_id : parseInt(req.params.user_id)};
    schedule_db.collection("schedule_clt").find(query).toArray((err, schedule) => {
        if (err) return console.log(err);
        if (doesntExist(schedule)){
            res.send("The user with user_id doesn't have any study events\n")
            return;
        }
        res.send(schedule);
    })
})

/*
 * Add an event the schedule of the user with with user_id.\
 */
app.post('/user/:user_id/schedule', (req,res) => {

    if (doesntExist(req.body)){
        res.status(400).send("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻\n");
        return;
    } 

    user_db.collection("info_clt").find({ user_id : parseInt(req.params.user_id)}).toArray((err, user_info) => {

        if (doesntExist(user_info)){
            res.send("You are trying to post a schedule to a user that doesnt exist (┛ಠ_ಠ)┛彡┻━┻\n")
            return;
        }

        /* Create schedule object */
        schedule_db.collection("schedule_clt").insertOne(
            {'user_id' : parseInt(req.params.user_id),
             'event_id' : parseInt(req.body.event_id),
             'time' : req.body.time,
             'date' : req.body.date,
             'course' : req.body.course,
             'location' : req.body.location},(err, result) => {
            if (err) return console.log(err);
            console.log('Schedule added')
        })
        /* Create a match object for that schedule */
        user_db.collection("matches_clt").insertOne(
            {'user_id' : parseInt(req.params.user_id),
             'event_id' : parseInt(req.body.event_id),
             'time' : req.body.time,
             'date' : req.body.date,
             'wait' : [],
             'request' : [],
             'potential_matches' : [],
             'match' : -1},(err, result) => {
               if (err) return console.log(err);
               console.log('matches document init done')
               res.send("Schedule has been posted!! :)")
        })
    })
})

/*
 * Update the schedule of the user with with user_id.
 *
 *  {'time' : '13:00 - 14:00',
 *   'date' : 'Oct. 4, 2019'
 *   'course' : 'CPEN 321',
 *   'location' : 'Irving K. Barber'}
 *
 * Tung: Can you add error checking here
 */
app.put('/schedule/:user_id/:event_id', (req,res) => {
    /* First need to delete the current corresponding maches */
    matches_delete(req.params.user_id, req.params.event_id);
    /* Create a new corresponding matches */
    user_db.collection("matches_clt").insertOne( // should this be insert or update?
        {'user_id' : parseInt(req.params.user_id),
         'event_id' : parseInt(req.params.event_id),
         'time' : req.body.time,
         'date' : req.body.date,
         'wait' : [],
         'request' : [],
         'potential_matches' : [],
         'match' : -1},(err, result) => {
           if (err) return console.log(err);
           console.log('matches document init done')
           res.send("Schedule has been posted")
    })

    /* Actually update the schedule */
    var query = {"user_id" : parseInt(req.params.user_id), "event_id" : parseInt(req.params.event_id)};
    var newValues = {$set: req.body};
    schedule_db.collection("schedule_clt").updateOne(query, newValues,(err, result) => {
    if (req.body == null) {
     res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
     return;
    }
     if (err) return console.log(err);
     res.send("Schedules have been updated.\n");
    })
})

/*
 * Delete every event in the user's schedule
 *
 * Tung: Can you add error checking here
 */
app.delete('/user/:user_id/schedule/:num_events', (req,res) => {
    /* Delete every single corresponding match */
    for(var i = 0; i < parseInt(req.params.num_events); i++){
      matches_delete(req.params.user_id, i);
    }
    /* Now actually delete the schedule */
    var query = {"user_id" : parseInt(req.params.user_id)};
    console.log(parseInt(req.params.user_id));
    schedule_db.collection("schedule_clt").deleteOne(query, (err, result) => {
        if (err) return console.log(err);
        res.send("deleted the schedule\n");
    })
})

/*
 * Delete a study event with of the user with user_id at a certain time and date.
 * !! We will need to find a way to differentiate between study events. !!
 *
 * Tung: Can you add error checking here
 */
app.delete('/user/:user_id/schedule/:event_id', (req,res) => {
    /*
     *  Before deleting the schedule, we need to delete the matching first
     *  This function is written in the matches sections
     */
    matches_delete(parseInt(req.params.user_id), parseInt(req.params.event_id));

     /* Now actually delete the schedule */
    var query = {"user_id" : req.params.user_id, "event_id" : parseInt(req.params.event_id)};
    schedule_db.collection("schedule_clt").deleteOne(query, (err, result) => {
        if (err) return console.log(err);
        res.send("deleted the specific time\n");
        })
    })
