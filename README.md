# Se7en
Project for CPEN 321

## Main idea & Motivation
Se7en is an app that allows users (specifically UBC students) to manage their studying schedules in 1-week intervals and connect to peers based on various filters/criteria of interests. 
Due to the importance of collaboration in studying and socializing of students, the app integrates both aspects to helps students to maximize their efficiency in studying and make more friends/study groups.

## Features
***Calendar*** - Schedule & Peer-matching manager 
- Add & manage study plans 
- Share schedule with friends
- Receive information of others who are also having the same time frame in schedule after updating schedule
- Filter based on interests (subjects/specific person, etc.)
- Manually match with other users of interests & book a meeting

***Authentication*** (Email/Facebook/Google)
- Using Facebook/Google login APIs

***Push notifications***
- Get notified whenever get matched or friends are also studying at the same planned location/time

## Bonus Features
***Messenger***
- Real-time communicating for matched users

***Sharing plans on other social media platforms*** 
- Facebook, Google, Twitter, etc.

## REST endpoints
Below is a description of the REST endpoints we will be using to implement Se7en. Each endpoint in this documentation is accompanied with a sample JSON object.

## GET
`/user/:user_id/preferences` : Get the preferences of the user with user_id.

       {'user_id' : 0,
       'kindness' : 2.0,
       'patience' : 6.0,
       'hard_working' : 4.0,
       'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
       'sex' : 1,
       'year_level' : [3, 4, ...]}

`/user/:user_id/info` : Get the info of the user with user_id. 

       {'year_level' : 3,
       'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
       'sex' : 0,
       'number_of_ratings' : 15,
       'kindness' : 3.4,
       'patience' : 7.6,
       'hard_working' : 1.0,
       'authentication_token' : ‘abcdef123456789’,
       'password' : ‘johndoe@123’,
       'user_id' : 0,
       'email' : ‘john.doe@gmail.com’,
       'name' : 'John Doe'}

`/user/:user_id/matches/potential_matches` : Get a sorted list of the user with user_id's potential, waiting and current matches.

       {'user_id' : 0,
       'event_id' : 0,
       'time' : "1:00-2:00",
       'date' : "Oct. 17, 2019",
       'wait' : [3,4,5],
       'request' : [8,9,10],
       'potential_matches' : [1,2],
       'match' : 7}

`/user/:user_id/matches/currently_matched_with` : Get who the user is currently matched with.

       {"current_matches" : [0,1,2,3]}
         
 `/user/:user_id/matches/user_is_waiting_to_match_with` : Get who the user is waiting to match with.
 
       {"wait" : [0,1,2,3]}

 `/schedule/:user_id/:event_id` : Get the user with user_id's schedule at a specific study event.
 
       {‘user_id’ : 0,
        'event_id' : 0,
        'time' : '13:00 - 14:00',
        'date' : 'Oct. 4, 2019'
        'course' : 'CPEN 321',
        'location' : 'Irving K. Barber'}

 `/schedule/:user_id` : Get the user with user_id's whole schedule.
 
       {‘user_id’ : 0,
        'event_id' : 0,
        'time' : '13:00 - 14:00',
        'date' : 'Oct. 4, 2019'
        'course' : 'CPEN 321',
        'location' : 'Irving K. Barber'}

## POST

 `/user/:user_id` : Sign up a new user (add to the database).
 
       {'year_level' : 3,
       'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
       'sex' : 0,
       'number_of_ratings' : 15,
       'kindness' : 3.4,
       'patience' : 7.6,
       'hard_working' : 1.0,
       'authentication_token' : ‘abcdef123456789’,
       'password' : ‘johndoe@123’,
       'email' : ‘john.doe@gmail.com’,
       'name' : 'John Doe'}

 `/user/:user_id/schedule` : Add an event the schedule of the user with with user_id.
 
       {‘user_id’ : 0,
       'event_id' : 0,
       'time' : '13:00 - 14:00',
       'date' : 'Oct. 4, 2019'
       'course' : 'CPEN 321',
       'location' : 'Irving K. Barber'}
       
  `/user/:user_id/preferences` : Post the preferences of the user with user_id.

       {'user_id' : 0,
       'kindness' : 2.0,
       'patience' : 6.0,
       'hard_working' : 4.0,
       'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
       'sex' : 1,
       'year_level' : [3, 4, ...]}
       
   `/user/:user_id_a/matches/:user_id_b` : Match user with user_id_a with user with user_id_b.

       {'event_id_a' : 0,
        'event_id_b' : 2}

## PUT

  `/user/:user_id/preferences` : Update the preferences of the user with user_id.
  
      {'kindness' : 2,
       'patience' : 6,
       'hard_working' : 4,
       'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
       'sex' : 0,
       'year_level' : [3, 4, ...]}

  `/user/:user_id/info` : Update the information of user with user_id's information.

       {'year_level' : 3,
        'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...],
        'sex' : 0,
        'number_of_ratings' : 15,
        'kindness' : 3.4,
        'patience' : 7.6,
        'hard_working' : 1.0,
        'authentication_token' : ‘abcdef123456789’,
        'password' : ‘johndoe@123’,
        'email' : ‘john.doe@gmail.com’,
        'name' : 'John Doe'}
       
   `/schedule/:user_id/:event_id` : Update the schedule of the user with with user_id.
 
       {'time' : '13:00 - 14:00',
       'date' : 'Oct. 4, 2019'
       'course' : 'CPEN 321',
       'location' : 'Irving K. Barber'}

## DELETE

   `/user/:user_id/matches/:match_id` : Unmatch user with user_id with user with match_id and vice versa.
   
   `/user/:user_id/schedule/:num_events` : Delete every event in the user's schedule given the number of events.
   
   `/user/:user_id/schedule/:event_id` : Delete a study event with of the user with user_id at a certain time and date.
