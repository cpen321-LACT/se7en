module.exports = {
    userInDB: function (user_db, req) {

    var user_query = {user_id : parseInt(req.body.user_id)};

    /* Check if the user exists in the database */
    user_db.collection("info_clt").find(user_query).toArray((err, user) => {
        if (isEmpty(user)){
            res.status(400).send("You are posting user preferences for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }
    
        if (isEmpty(req.body)){
            res.status(400).send("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        } 
    
        if (!isAcceptablePreferences(parseFloat(req.body.kindness), parseFloat(req.body.patience), parseFloat(req.body.hard_working)) ){
            res.status(400).send("kindness, patience and hard_working do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻\n");
            return;
        }
        console.log("No errors\n")
    })



    },
    bar: function () {
      // whatever
    }
  };