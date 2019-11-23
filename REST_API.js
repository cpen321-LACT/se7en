const express = require("express");
const mongocli = require("mongodb").MongoClient;

const app = express();
app.use(express.json());

var userDb;
var scheduleDb;

var doesntExist = function(obj) {
    return Object.keys(obj).length === 0;
};

var isAcceptablePreferences = function(a,b,c) {
    return a + b + c === 12;
};

/*
* Connect to the mongodb database
*/

mongocli.connect("mongodb://localhost:27017", {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  if (err) {return err;}

  userDb = client.db("userDb");
  scheduleDb = client.db("scheduleDb");

  /* User Database */
  userDb.createCollection("infoClt", function(err, res) {
    if (err) {throw err;}
     console.log("Info collection created!");
  });
  userDb.createCollection("preferencesClt", function(err, res) {
    if (err) {throw err;}
     console.log("Peferences collection created!");
  });
  userDb.createCollection("matchesClt", function(err, res) {
    if (err) {throw err;}
  });

  /* Schedule Database */
  scheduleDb.createCollection("scheduleClt", function(err, res) {
    if (err) {throw err;}
     console.log("Schedule collection created!");
  });

   app.listen(3000, function() {
    //   console.log("server is up!");
   })

})
//module.exports = app;


/*______________________________________________________________________________________
 * Helper funtions used for the match algorithm
 *______________________________________________________________________________________*/

function insertionSort(array, score){
    for(var i = 0; i < array.length; i++){
        var sc = score[parseInt(i, 10)][0]; //score
        var id = score[parseInt(i, 10)][1]; //userId
        var j = i;
        while(j>0 && score[j-1][0] > sc){
            score[parseInt(j, 10)][0] = score[j-1][0];
            score[parseInt(j, 10)][1] = score[j-1][1];
            j--;
        }
        score[parseInt(j, 10)][0] = sc;
        score[parseInt(j, 10)][1] = id;
    }
    return score;
}


/* A helper function used for sorting algorithm */
function generateMatch(personPre, array){
    var kindness = personPre.kindness;
    var hardWorking = personPre.hardWorking;
    var patience = personPre.patience;
    // Create one dimensional array
    var score = new Array(array.length);
    var i;
    // Loop to create 2D array using 1D array
    for (i = 0; i < score.length; i++) {
        score[parseInt(i, 10)] = new Array(2);
    }
    for(i = 0; i < array.length; i++){
        score[parseInt(i, 10)][0] =   Math.abs(kindness - array[parseInt(i, 10)].kindness) +
                        Math.abs(hardWorking - array[parseInt(i, 10)].hardWorking) +
                        Math.abs(patience - array[parseInt(i, 10)].patience);
        score[parseInt(i, 10)][1] =   array[parseInt(i, 10)].userId;
    }

    insertionSort(array, score);

    var ret = [];
    for(i = 0; i < array.length; i++){
       ret[parseInt(i, 10)] = score[parseInt(i, 10)][1];
    }

    return ret;
}
function accept(infor, userId, otherUserId){
    return ((infor === userId) && (infor !== otherUserId));
}
/* A helper function that filters the array by the time, date */
function timeFilterMatch(inforArray, scheduleArray, userId){
    var filteredMatches = [];
    for(var i = 0; i < inforArray.length; i++){
        var infor = parseInt(inforArray[parseInt(i, 10)].userId, 10);
        for(var j = 0; j < scheduleArray.length; j++){
            if (accept(infor, parseInt(scheduleArray[parseInt(j, 10)].userId, 10), userId)){
                filteredMatches.push(inforArray[parseInt(i, 10)]);
            }
        }
    }
    return filteredMatches;
}
/* Delete the all the requests that the given userId sent */
// function allRequestDelete(userId, wait, t, d){
//     for(var i = 0; i < wait.length; i++){
//         var requestedId = wait[parseInt(i, 10)];
//         var query = {"userId" : parseInt(requestedId, 10),
//                      "time" : t,
//                      "date" : d};
//         userDb.collection("match_clt").find(query).toArray((err,result) => {
//             if (err) {return err;}
//             result = JSON.stringify(result);
//             var request = result.request;
//             /* Find the id and delete it */
//             for(var j = 0; j < request.length; j++){
//                 if(parseInt(request[parseInt(j, 10)], 10) === parseInt(userId, 10)){
//                     request.splice(j,1);
//                     break;
//                 }
//             }
//             userDb.collection("matchs_clt").updateOne(query, request,(err, result) => {
//                 if (err) {
//                     return err; 
//                 }
//             })
//         })
//     }
// }
// function allWaitDelete(userId, request, t, d){
//     for(var i = 0; i < request.length; i++){
//         var waitedId = request[parseInt(i, 10)];
//         var query = {"userId" : parseInt(waitedId, 10),
//                      "time" : t,
//                      "date" : d};
//         userDb.collection("match_clt").find(query).toArray((err,result) => {
//             if (err) {return err;}
//             result = JSON.stringify(result);
//             var wait = result.wait;
//             /* Find the id and delete it */
//             for(var j = 0; j < wait.length; j++){
//                 if(parseInt(wait[parseInt(j, 10)], 10) === parseInt(userId, 10)){
//                     wait.splice(j,1);
//                     break;
//                 }
//             }
//             userDb.collection("matchesClt").updateOne(query, wait,(err, result) => {
//                 if (err) {
//                     return err;
//                 } 
//             })
//         })
//     }
// }
/* Delete the matching of 2 people */
function personMatchDelete(userId, t, d){
    var query = {"userId" : parseInt(userId, 10),
                 "time" : t,
                 "date" : d};
    var newValues = {$set:{"match" : null}};
    userDb.collection("matchesClt").updateOne(query, newValues,(err, result) => {
        if (err) {return 1;}
        return 0; 
    })
}
/*
 *  Delete the the matching with given time and userId.
 *  Modify other userId matches as needed.
 *  This will call for allRequestDelete, allWaitDelete, and personMatchDelete
 */
function matchesDelete(uid, eid){
    /* Read the match object into an object */
    var query = {"userId" : uid,
             "eventId" : eid};
    userDb.collection("matchesClt").find(query).toArray((err,result) => {
        if (err) {return err;}
        var matches = JSON.stringify(result);
        var wait = matches.wait;            /* Will later update the request list of people that this person requested */
        var request = matches.request;      /* Delete this list wont affect other people's matches */
        var matchPerson = matches.match;   /* Will later update the matched person's "match" to NULL  */
        var t = matches.time;
        var d = matches.date;
          /* Delete requests and waits to others */
        // allRequestDelete(uid, wait, t, d);
        // allWaitDelete(uid, request, t, d);
          /* Delete the matching person */
        if(matchPerson != null) {personMatchDelete(matchPerson, t, d);}

        /* Delete the match object */
        var query = {"userId" : uid, "time" : t, "date" : d};
        userDb.collection("scheduleClt").deleteOne(query, (err, result) => {
            if (err) {return err;}
        })
    })

}
/*______________________________________________________________________________________
 *  End of helper funtions used for the match algorithm
 *______________________________________________________________________________________*/

/*---------------------------- Preferences Collection ---------------------------- */

/*
 * Post the preferences of the user with userId.
 *
 * Will return an error if...
 * - the user does not exist in the database
 * - the sum of kindness, patience and hardWorking does not equal 12
 * - you send a sex that is not in range
 */
app.post("/user/:userId/preferences", async (req,res) => {

    var userQuery = {userId : parseInt(req.params.userId, 10)};

    if (doesntExist(req.body)){
        res.status(400).send({message : "The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻"});
        return;
    }
    else if (!isAcceptablePreferences(parseFloat(req.body.kindness), parseFloat(req.body.patience), parseFloat(req.body.hardWorking)) ){
        res.status(400).send({message :"kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻"});
        return;
    }
    else if (parseInt(req.body.sex, 10) < 0 || parseInt(req.body.sex, 10) > 2) {
        res.status(400).send({message : "THERE ARE ONLY 3 SEXES (FOR PREFERENCES) (┛ಠ_ಠ)┛彡┻━┻"});
        return;
    }

    /* Check if the user exists in the database */
    userDb.collection("infoClt").find(userQuery).toArray((err, user) => {

        if (doesntExist(user)){
            res.status(400).send({message : "You are posting user preferences for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        }
        /* Add the users preferences */
        userDb.collection("preferencesClt").insertOne(
            {"userId"      : parseInt(req.params.userId, 10),
             "kindness"     : parseFloat(req.body.kindness),
             "patience"     : parseFloat(req.body.patience),
             "hardWorking" : parseFloat(req.body.hardWorking),
             "courses"      : req.body.courses,
             "sex"          : parseInt(req.body.sex, 10),
             "yearLevel"   : req.body.yearLevel},(err, result) => {
         if (err) {return err;}
         res.status(200).send({message : "Preferences have been added. ٩(^ᴗ^)۶"});
        })
    })
})

/*
 * Get the preferences of the user with userId.
 *
 * Below is a sample JSON output:
 *
 * {'userId' : 0,
 *  'kindness' : 2.0,
 *  'patience' : 6.0,
 *  'hardWorking' : 4.0,
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
 *  'sex' : 1,
 *  'yearLevel' : [3, 4, ...]}
 */
app.get("/user/:userId/preferences", async (req,res) => {

    var userQuery = {userId : parseInt(req.params.userId, 10)};

    userDb.collection("preferencesClt").find(userQuery).toArray((err, user) => {
        if (doesntExist(user)){
            res.status(400).send({message : "You are trying to GET preferences of a user that doesn't exist in the database (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        } else {
            res.status(200).send(user);
        }
    })
})

/*
 * Update the preferences of the user with userId.
 *
 * Below is a sample JSON input:
 *
 * {'kindness' : 2,
 *  'patience' : 6,
 *  'hardWorking' : 4,
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
 *  'sex' : 0,
 *  'yearLevel' : [3, 4, ...]}
 */
app.put("/user/:userId/preferences", async (req,res) => {
    var userQuery = {"userId" : parseInt(req.params.userId, 10)};
    var newValues = {$set: req.body};

    /* Check if the user exists in the database */
    userDb.collection("infoClt").find(userQuery).toArray((err, user) => {

        if (doesntExist(req.body)){
            res.status(400).send({message:"you sent a null body (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        }

        if (!isAcceptablePreferences(parseFloat(req.body.kindness, 10), parseFloat(req.body.patience, 10), parseFloat(req.body.hardWorking, 10)) ){
            res.status(400).send({message:"kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        }

        if (doesntExist(user)){
            res.status(400).send({message:"You are updating user preferences for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        }

        /* No errors, update the user preferences */
        userDb.collection("preferencesClt").updateOne(userQuery, newValues,(err, result) => {
            if (err) {return err;}
            res.send({message : "Preferences have been updated. ٩(^ᴗ^)۶"});
        })
    })
})

/*---------------------------- Info Collection ---------------------------- */

/*
 * Get the user with userId's information.
 *
 * Below is a sample JSON output:
 *
 * {'yearLevel' : 3,
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
 *  'sex' : 0,
 *  'numberOfRatings' : 15,
 *  'kindness' : 3.4,
 *  'patience' : 7.6,
 *  'hardWorking' : 1.0,
 *  'authenticationToken' : ‘abcdef123456789’,
 *  'password' : ‘johndoe@123’,
 *  'userId' : 0,
 *  'email' : ‘john.doe@gmail.com’,
 *  'name' : 'John Doe'}
 */
app.get("/user/:userId/info", async (req,res) => {
    if(parseInt(req.params.userId, 10) < 0){
        res.status(400).json({message: 'The user id is less tahn 0 (┛ಠ_ಠ)┛彡┻━┻'});
        return;
    }
    userDb.collection("infoClt").find({ userId : parseInt(req.params.userId, 10)}).toArray((err, userInfo) => {
        if (doesntExist(userInfo)){
            res.status(400).json({message:"You are trying to get user info for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻"});
            return err;
        }
        if (err) {return err;}
            res.send(userInfo);
    })
})

/*
 * Sign up a new user. Also initialize thier matches to no one.
 *
 * Below is a sample JSON input:
 *
 * {'yearLevel' : 3,
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
 *  'sex' : 0,
 *  'numberOfRatings' : 15,
 *  'kindness' : 3.4,
 *  'patience' : 7.6,
 *  'hardWorking' : 1.0,
 *  'authenticationToken' : ‘abcdef123456789’,
 *  'password' : ‘johndoe@123’,
 *  'email' : ‘john.doe@gmail.com’,
 *  'name' : 'John Doe'}
 */
app.post("/user/:userId", async (req,res) => {


    userDb.collection("infoClt").find({ userId : parseInt(req.params.userId, 10)}).toArray((err, userInfo) => {

        // if (!isAcceptablePreferences(parseFloat(req.body.kindness), parseFloat(req.body.patience), parseFloat(req.body.hardWorking)) ){
        //     res.status(400).send({message : "kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻"});
        //     return;
        // }

        // if (parseInt(req.body.sex, 10) < 0 || parseInt(req.body.sex, 10) > 1) {
        //     res.status(400).send({message : "THERE ARE ONLY 2 SEXES (┛ಠ_ಠ)┛彡┻━┻"});
        //     return;
        // }

        // if (doesntExist(req.body)){
        //     res.status(400).send({message : "The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻"});
        //     return;
        // }

        userDb.collection("infoClt").insertOne(
            {"yearLevel"           : req.body.yearLevel,
             "sex"                  : parseInt(req.body.sex, 10),
             "courses"              : req.body.courses,
             "numberOfRatings"      : parseInt(req.body.numberOfRatings, 10),
             "kindness"             : parseFloat(req.body.kindness),
             "patience"             : parseFloat(req.body.patience),
             "hardWorking"         : parseFloat(req.body.hardWorking),
             "authenticationToken" : null,
             "password"             : req.body.password,
             "userId"              : parseInt(req.params.userId, 10),
             "email"                : req.body.email,
             "name"                 : req.body.name},(err, result) => {


         if (err) {return err;}
            res.send({message : "The user has been added to the database!"}).status(200);
        })
    })
})


/*
 * Sign up a new user with authentication
 */
app.post("/user/authentication/:authenticationToken", async (req,res) => {

        userDb.collection("infoClt").insertOne(
            {"yearLevel"           : null,
             "sex"                  : null,
             "courses"              : null,
             "numberOfRatings"      : null,
             "kindness"             : null,
             "patience"             : null,
             "hardWorking"         : null,
             "authenticationToken" : req.params.authenticationToken,
             "password"             : null,
             "userId"              : null,
             "email"                : null,
             "name"                 : null},(err, result) => {
         if (err) {return err;}
            res.send({message : "The user with authentication has been added to the database!"}).status(200);
        })
})


/*
 * Update the information of user with userId's information.
 *
 * Below is a sample JSON input:
 *
 * {'yearLevel' : 3,
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
 *  'sex' : 0,
 *  'numberOfRatings' : 15,
 *  'kindness' : 3.4,
 *  'patience' : 7.6,
 *  'hardWorking' : 1.0,
 *  'authenticationToken' : ‘abcdef123456789’,
 *  'password' : ‘johndoe@123’,
 *  'userId' : 0,
 *  'email' : ‘john.doe@gmail.com’,
 *  'name' : 'John Doe'}
 */
app.put("/user/:userId/info", async (req,res) => {
    var query = {userId : parseInt(req.params.userId, 10)};
    var newValues = {$set: {yearLevel           : parseInt(req.body.yearLevel, 10),
                            sex                  : parseInt(req.body.sex, 10),
                            courses              : req.body.courses,
                            numberOfRatings    : parseInt(req.body.numberOfRatings, 10),
                            kindness             : parseFloat(req.body.kindness, 10),
                            patience             : parseFloat(req.body.patience, 10),
                            hardWorking         : parseFloat(req.body.hardWorking, 10),
                            authenticationToken : req.body.authenticationToken,
                            password             : req.body.password,
                            email                : req.body.email,
                            name                 : req.body.name}};

    userDb.collection("infoClt").find({ userId : parseInt(req.params.userId, 10)}).toArray((err, userInfo) => {
        if (doesntExist(req.body)){
            res.status(400).send({message : "The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        }

        if (!isAcceptablePreferences(parseFloat(req.body.kindness, 10), parseFloat(req.body.patience, 10), parseFloat(req.body.hardWorking, 10)) ){
            res.status(400).send({message : "kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        }

        if (parseInt(req.body.sex, 10) < 0 || parseInt(req.body.sex, 10) > 1) {
            res.status(400).send({message : "THERE ARE ONLY 2 SEXES (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        }

        if (!doesntExist(userInfo)){
            res.status(400).send({message : "The user with this userId doesn't exists in the database (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        }

        userDb.collection("infoClt").updateOne(query, newValues,(err, result) => {
             if (err) {return err;}
             res.send({message : "The user info has been updated! ヽ(＾Д＾)ﾉ"});
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
app.delete("/user/:userId/info", async (req,res) => {
    var query = {"userId" : parseInt(req.params.userId, 10)};

    if (parseInt(req.params.userId, 10) < 0) {
        res.send({message : "Invalid userId"});
        return;
    }

    scheduleDb.collection("infoClt").deleteOne(query, (err, result) => {
        if (err) {return err;}
        res.send({message : "deleted the user"});
    })
})

/*---------------------------- Matches Collection ---------------------------- */

/*
 * Get a sorted list of the user with userId's potential,
 * waiting and current matches.
 *
 * Below is a sample JSON input:
 *  {'userId’: 0,
 *   'yearLevel' : 3,
 *  'eventId': 2,
 *  'kindness' : 3,
 *  'hardWorking' : 3,
 *  'patience' : 6}
 *
 *  Tung: can you change this so it doesnt require a body to work
 */
app.get("/user/:userId/matches/potentialMatches/:eventId", async (req,res) => {
    
    /* Read the preference */
    var query = {"userId": req.params.userId, "eventId": req.params.eventId};
    scheduleDb.collection("scheduleClt").find(query).toArray((err, personSch) => {
        if(err){return err;}
    var thisCourse = personSch.course;
    var query = {"userId" : req.params.userId};
    userDb.collection("preferencesClt").find(query).toArray((err,personPre) => {
        if(err){return err;}
    //var thisKindness = parseFloat(personPre[0].kindness,10);
    var thisHardWorking = parseFloat(personPre.hardWorking, 10);
    var thisPatience = parseFloat(personPre.hardWorking, 10);
    var thisYearLevel = parseInt(personPre.yearLevel, 10);
    var thisSex = parseInt(personPre.sex, 10);
    
    /*_________________________________________________________
     * Get the info array of standard vars from the userId
     *_________________________________________________________ */
    var query = {"yearLevel" : thisYearLevel,
                 "sex" : thisSex};
    /* Filter all standard criteria to an array */
    userDb.collection("infoClt").find(query).toArray((err,inforArray) => {
        if (err) {return err;}

        var info = inforArray;

    var timeDateQuery = {"userId" : parseInt(req.param.userId, 10),
                           "eventId" : parseInt(req.params.eventId, 10)};

    scheduleDb.collection("scheduleClt").find(timeDateQuery).toArray((err, userScheduleEvent) => {

      if (userScheduleEvent[0] === null){
        res.send("There are no users in the database\n");
        return;
      }

    var t = userScheduleEvent.time;
    var d = userScheduleEvent.date;

    /*_________________________________________________________
     * Get the schedule array of specific time
     *_________________________________________________________ */
    var query = {"time" : t,
                 "date" : d,
                 "course" : thisCourse};

    /* Filter all standard time to an array */
    scheduleDb.collection("scheduleClt").find(query).toArray((err,scheduleArray) => {
        if (err) {return err;}
        /* the user cannot be a potential match of him/herself */
        var schedule = scheduleArray;

    /*_________________________________________________________
     * Call the time-filter function
     * Call for the function generateMatch which sort all the matches
     * and return an array "ret" of potential matches and put that into the database
     *_________________________________________________________ */
    var stdMatchArray = timeFilterMatch(info, schedule, parseInt(req.params.userId, 10));

    var ret = generateMatch(personPre, stdMatchArray);

    var query = {"userId" : parseInt(req.params.userId, 10),
                 "eventId" : parseInt(req.params.eventId, 10)};
    var newValues = {$set:{"potentialMatches" : ret}};
    userDb.collection("matchesClt").updateOne(query, newValues,(err, result) => {
        if(req.body === null){
            res.status(400).send("(┛ಠ_ಠ)┛彡┻━┻\n");
            return;}
    /* Return the potential match array */
    userDb.collection("matchesClt").find(query).toArray((err,result) => {
        if (err) {return err;}
        /* return the potential matches */
        res.status(200).send(result);
    }) }) }) }) }) }) })
})


/*
 * Match user with userId userIdA with user with userId userIdB.
 *
 * Update currentlyMatchedWith array for user_a and user_b
 *
 * Sample JSON input:
 * { "eventId_a : 0, "eventId_b" : 2}
 * Adam: to test
 */
function updateRequestWait(userAMatchDoc, userBMatchDoc){

    /* If user_b has already requested to match with user_a and is waiting */
    if (userBMatchDoc["wait"].includes(parseInt(req.params.userIdA, 10))) {

        /* user_b is user_a's match */
        userAMatchDoc["match"] = parseInt(req.params.userIdB, 10);
        /* user_a to user_b's match */
        userBMatchDoc["match"] = parseInt(req.params.userIdA, 10);

        userBMatchDoc["wait"].splice(userBMatchDoc["wait"].indexOf(parseInt(req.params.userIdA, 10)), 1);
        userAMatchDoc["request"].splice(userAMatchDoc["request"].indexOf(parseInt(req.params.userIdB, 10)), 1);

    }
    else {
        /* user_a has requested to match with user_b*/
        userBMatchDoc["request"].push(parseInt(req.params.userIdA, 10));

        /* user_a is waiting to match with user_b */
        userAMatchDoc["wait"].push(parseInt(req.params.userIdB, 10));

    }
    return;
}
/* Need eventId in body */
app.post("/user/:userIdA/matches/:userIdB", async (req,res) => {
    var queryUserA = { userId : parseInt(req.params.userIdA, 10), "eventId" : parseInt(req.body.eventId_a, 10)};
    var queryUserB = { userId : parseInt(req.params.userIdB, 10), "eventId" : parseInt(req.body.eventId_b, 10)};

    if (parseInt(req.params.userIdA, 10) === parseInt(req.params.userIdB, 10)){
        res.status(400).send({message : "Cannot match the user with themselves."});
        return;
    }

    if (parseInt(req.params.userIdA, 10) < 0 ||  parseInt(req.params.userIdB, 10) < 0){
        res.status(400).send({message : "Negative userId"});
        return;
    }


    var userAMatchDoc;
    var userBMatchDoc;

    /* Get user_a's match document for a specific time and date */
    userDb.collection("matchesClt").find(queryUserA).toArray((err, a) => {
        if (err) {return err;}
        if (doesntExist(a)){
            res.status(400).send({message:"User A doesn't exist"});
            return err;
        }
        userAMatchDoc = a[0];

        /* Get user_b's match document for a specific time and date */
        userDb.collection("matchesClt").find(queryUserB).toArray((err, b) => {
            if (err) {return err;}
            if (doesntExist(b)){
                res.status(400).send({message:"User B doesn't exist"});
                return err;
            }
            userBMatchDoc = b[0];

            updateRequestWait(userAMatchDoc, userBMatchDoc);

            /* Update user_a's matches */
            userDb.collection("matchesClt").updateOne(queryUserA, {$set: {match : userAMatchDoc.match, request : userAMatchDoc.request, wait : userAMatchDoc.wait}}, (err, updateResultA) => {
                if (err) { res.status(400).send({message : "User A Error"}); return err;}

                    /* Update user_b's matches */
                userDb.collection("matchesClt").updateOne(queryUserB, {$set: {match : userBMatchDoc.match, request : userBMatchDoc.request, wait : userBMatchDoc.wait}}, (err, updateResultB) => {
                    if (err) { res.status(400).send({message : "User B Error"}); return err;}

                    res.status(200).send({message : "Successfully added matches."});
                })
            })
        })
    })
})

/*
 * Get who the user is currently matched with.
 * Adam: To test
 */
app.get("/user/:userId/matches/currentlyMatchedWith", async (req,res) => {

    if (parseInt(req.params.userId, 10) < 0){
        res.status(400).send({message:"Negative userId"});
        return;
    }

    var curMatches = [];
    var i;
    /* Find all the match documents for a specified user */
    userDb.collection("matchesClt").find({ userId : parseInt(req.params.userId, 10)}).toArray((err, matches) => {
        if (err) {return err;}
        if (doesntExist(matches)){
            res.status(400).send({message:"The user with userId doesnt have any matches"});
        }
        /* Generate the current matches */
        for (i = 0; i < matches.length-1; i++){
            /* if the user has a match */
            if (matches[parseInt(i, 10)]["match"] != null) {
                /* Add the match to the list */
                curMatches.append(
                    {"time" : matches[parseInt(i, 10)]["time"],
                    "date" : matches[parseInt(i, 10)]["date"],
                    "match" : matches[parseInt(i, 10)]["match"]});
            }
        }
        /* Return JSON object*/
        res.send({"current_matches" : curMatches});
    })
})

/*
 * Get who the user is waiting to match with
 * Adam: To test
 */
app.get("/user/:userId/matches/userIsWaitingToMatchWith", async (req,res) => {
    userDb.collection("matchesClt").find({ userId : parseInt(req.params.userId, 10)}).toArray((err, result) => {
        if (err) {return err;}
        res.send(result["wait"]);
    })
})

/*
 * Unmatch user with userId with user with matchId and vice versa.
 * This will call helper function personMatchDelete()
 * Tung: Can you test this
 */
app.delete("/user/:userId/matches/:matchId", async (req,res) => {
    userDb.collection("matchesClt").find({ userId : parseInt(req.params.userId, 10)}).toArray((err, result) => {
        if (err) {return err;}
        if(parseInt(result["wait"], 10) !== parseInt(req.params.matchId, 10)){
            res.status(400).send({message: "Two people are not matched, something is wrong here :<"});
        }

    var err1 = personMatchDelete(req.param.userIdA, req.body.time, req.body.date);
    var err2 = personMatchDelete(req.param.userIdB, req.body.time, req.body.date);
    if(err1 || err2) {return (err1 || err2);} 
    res.send({message: "Successfully unmatch."});
    })
})


/* ________________________________End points for cleaning and get all database_______________________________ */
 app.get("/get_all_users",  async (req,res) => {
     userDb.collection("infoClt").find().toArray((err, a) => {
        //  console.log(a);
         res.send(a);
     })
 })

 app.delete("/delete_all_users", async (req,res) => {
     userDb.collection("infoClt").deleteMany({},(err, a) => {
        //  console.log(a);
         res.send(a);
     })
 })

app.get("/get_all_schedules", async (req,res) => {
    scheduleDb.collection("scheduleClt").find().toArray((err, a) => {
        // console.log(a)
        res.send(a);
    })
})

app.get("/get_all_matches", async (req,res) => {
    userDb.collection("matchesClt").find().toArray((err, a) => {
        // console.log(a);
        res.send(a);
    })
})

app.get("/get_all_preferences", async (req,res) => {
    userDb.collection("preferencesClt").find().toArray((err, a) => {
        // console.log(a);
        res.send(a);
    })
})


app.delete("/delete_all_schedules", async (req,res) => {
    scheduleDb.collection("scheduleClt").deleteMany({},(err, a) => {
        // console.log(a)
        res.send(a);
    })
})

app.delete("/delete_all_matches", async (req,res) => {
    userDb.collection("matchesClt").deleteMany({},(err, a) => {
        // console.log(a)
        res.send(a);
    })
})

app.delete("/delete_all_preferences", async (req,res) => {
    userDb.collection("preferencesClt").deleteMany({},(err, a) => {
        // console.log(a)
        res.send(a);
    })
})
/* ________________________________________________________________________________________ */

/*---------------------------- Schedule Collection ---------------------------- */


/*
 * Get the user with userId's schedule at a specific study event.
 *
 * Below is a sample JSON output:
 *
 * { ‘userId’ : 0,
 *   'eventId' : 0,
 *   'time' : '13:00 - 14:00',
 *   'date' : 'Oct. 4, 2019'
 *   'course' : 'CPEN 321',
 *   'location' : 'Irving K. Barber'}
 */
app.get("/schedule/:userId/:eventId", async (req,res) => {
    var query = {eventId : parseInt(req.params.eventId, 10),            
                 userId : parseInt(req.params.userId, 10)};

    scheduleDb.collection("scheduleClt").find(query).toArray((err, result) => {
        if (doesntExist(result)){
            console.log("HERE");
            res.status(400).send({message: "The study event with eventId for user with userId doesn't exist"});
            return err;
        }
        if (err) {return err;}
        res.status(200).send(result);
    })
})

/*
 * Get the user with userId's whole schedule.
 *
 * Below is a sample JSON output:
 *
 * { ‘userId’ : 0,
 *   'eventId' : 0,
 *   'time' : '13:00 - 14:00',
 *   'date' : 'Oct. 4, 2019'
 *   'course' : 'CPEN 321',
 *   'location' : 'Irving K. Barber'}
 */
app.get("/schedule/:userId", async (req,res) => {
    var query = {userId : parseInt(req.params.userId, 10)};
    scheduleDb.collection("scheduleClt").find(query).toArray((err, schedule) => {
        if (err) {return err;}
        if (doesntExist(schedule)){
            res.status(400).send({message: "The user with userId doesn't have any study events"});
            return err;
        }
        res.status(200).send(schedule);
    })
})

/*
 * Add an event the schedule of the user with with userId.\
 */
app.post("/schedule/:userId/", async (req,res) => {

    if (doesntExist(req.body)){
        res.status(400).send({message: "The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻"});
        return;
    }

    userDb.collection("infoClt").find({ userId : parseInt(req.params.userId, 10)}).toArray((err, userInfo) => {

        if (doesntExist(userInfo)){
            res.status(400).send({message: "You are trying to post a schedule to a user that doesnt exist (┛ಠ_ಠ)┛彡┻━┻"});
            return;
        }

        /* Create schedule object */
        scheduleDb.collection("scheduleClt").insertOne(
            {"userId" : parseInt(req.params.userId, 10),
             "eventId" : parseInt(req.body.eventId, 10),
             "time" : req.body.time,
             "date" : req.body.date,
             "course" : req.body.course,
             "location" : req.body.location},(err, result) => {
            if (err) {return err;}
             console.log('Schedule added')
        })
        /* Create a match object for that schedule */
        userDb.collection("matchesClt").insertOne(
            {"userId" : parseInt(req.params.userId, 10),
             "eventId" : parseInt(req.body.eventId, 10),
             "time" : req.body.time,
             "date" : req.body.date,
             "wait" : [],
             "request" : [],
             "potentialMatches" : [],
             "match" : -1},(err, result) => {
               if (err) {return err;}
            //    console.log('matches document init done')
               res.status(200.).send({message: "Schedule has been posted!! :)"});
        })
    })
})

/*
 * Update the schedule of the user with with userId.
 *
 *  {'time' : '13:00 - 14:00',
 *   'date' : 'Oct. 4, 2019'
 *   'course' : 'CPEN 321',
 *   'location' : 'Irving K. Barber'}
 *
 * Tung: Can you add error checking here
 */
app.put("/schedule/:userId/:eventId", async (req,res) => {
    if (req.body === null) {
        res.status(400).send({message:"(┛ಠ_ಠ)┛彡┻━┻"});
        return;
    }
    if (doesntExist(req.body)) {
        res.status(400).send({message:"(┛ಠ_ಠ)┛彡┻━┻"});
        return;
    }
    /* First need to delete the current corresponding maches */
    matchesDelete(req.params.userId, req.params.eventId);
    /* Create a new corresponding matches */
    userDb.collection("matchesClt").insertOne( // should this be insert or update?
        {"userId" : parseInt(req.params.userId, 10),
         "eventId" : parseInt(req.params.eventId, 10),
         "time" : req.body.time,
         "date" : req.body.date,
         "wait" : [],
         "request" : [],
         "potentialMatches" : [],
         "match" : -1},(err, result) => {
           if (err) {return err;}
        //    console.log('matches document init done')
         //  res.send("Schedule has been posted");
    })

    /* Actually update the schedule */
    var query = {"userId" : parseInt(req.params.userId, 10), "eventId" : parseInt(req.params.eventId, 10)};
    var newValues = {$set: {
                    "time" : req.body.time,
                    "date" : req.body.date,
                    "course" : req.body.course,
                    "location" : req.body.location}};
    scheduleDb.collection("scheduleClt").updateOne(query, newValues,(err, result) => {
     if (err) {return err;}
     res.status(200).send({message:"Schedules have been updated."});
    })
})

/*
 * Delete every event in the user's schedule
 *
 * Tung: Can you add error checking here
 */
app.delete("/schedule/:userId/all/:numEvents", async (req,res) => {
    /* Delete every single corresponding match */
    
    var i;
    for(i = 0; i < parseInt(req.params.numEvents, 10); i++){
      matchesDelete(req.params.userId, i);
    }
    /* Now actually delete the schedule */
    var query = {"userId" : parseInt(req.params.userId, 10)};
    scheduleDb.collection("scheduleClt").find(query).toArray((err, schedule) => {
        if (err) {return err;}
        if (doesntExist(schedule)){
            res.status(400).send({message:"The user with userId doesn't have any schedules"});
            return err;
        }
    scheduleDb.collection("scheduleClt").deleteOne(query, (err, result) => {
        if (err) {return err;}
        res.send({message: "deleted the schedule"});
    }) })
})

/*
 * Delete a study event with of the user with userId at a certain time and date.
 * !! We will need to find a way to differentiate between study events. !!
 *
 * Tung: Can you add error checking here
 */
app.delete("/schedule/:userId/:eventId", async (req,res) => {
    /*
     *  Before deleting the schedule, we need to delete the matching first
     *  This function is written in the matches sections
     */
   // matchesDelete(parseInt(req.params.userId, 10), parseInt(req.params.eventId, 10));

     /* Now actually delete the schedule */
    var query = {"userId" : req.params.userId, "eventId" : parseInt(req.params.eventId, 10)};
    scheduleDb.collection("scheduleClt").find(query).toArray((err, schedule) => {
        if (err) {return err;}
        if (doesntExist(schedule)){
            res.status(400).send({message:"The user with userId doesn't have this schedule"});
            return err;
        }
    scheduleDb.collection("scheduleClt").deleteOne(query, (err, result) => {
        if (err) {return err;}
        res.status(200).send({message: "deleted the specific time"});
        }) })
    })
