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



## Using git branches
We will be using two main branches, frontend and backend (more can be made as desired). To change to the desired branch, run the following command in your git repo:
```
git checkout [branch_name]
```
you can read on git branches online

## REST endpoints
Below is a description of the REST endpoints we will be using to implement Se7en. Each endpoint in this documentation is accompanied with a sample JSON object.

## POST

**\user\{user_id}\sign_up** : Send a new user object to the backend. 

       // external API
 

## PUT

**\user\ {user_id}\info** : update a user's information. 

       {'year_level' : '3', 
       'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'], 
       'sex' : 'Male',
       'name' : 'John Doe'}

**\user\ {user_id} \schedule** : update a user's schedule with a study event. 

       {'time' : '13:00 - 14:00', 
        'date' : 'Oct. 4, 2019'
        'subject' : 'CPEN 321', 
        'location' : 'Irving K. Barber'}

**\user\ {user_id} \preferences** : update a user's preferences. 

       {'kindness' : '2', 
        'patience' : '6',
        'hard_working' : '4', 
        'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'], 
        'sex' : ['Male', 'Female'],
        'year_level' : ['3','4']}
      

## GET
**\user\ {user_id} \matches** : get a sorted list of user's matches based on preferences. 

       {'matches' : [{user_id_0}, {user_id_1}, {user_id_2}, {user_id_3}]} 

## DELETE
**\user\ {user_id} \schedule\ {schedule_id}** : delete a user's study event. 


