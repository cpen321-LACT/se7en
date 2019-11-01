
/*______________________________________________________________________________________
 * Helper funtions used for the match algorithm
 *______________________________________________________________________________________*/

/* A helper function used for sorting algorithm */
export function generateMatch(kindness, hard_working, patience, array){

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
export function time_filter_match(infor_array, schedule_array, user_id){
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
export function matches_delete(user_id, event_id){
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
export function all_request_delete(user_id, wait, time, date){
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
export function all_wait_delete(user_id, request, time, date){
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
export function person_match_delete(user_id, time, date){
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