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

**\create_user** : Send a new user object to the backend. 

       {'user_id' : '1', 
        'name' : 'Julia Rubin', 
        'email' : 'email@gmail.com', 
        'password' : 'password123',}
        
**\events\ {event_id}** : Send a calendar event to the backend. 

       {'time_start' : '23:00', 
        'time_end' : '24:00', 
        'date' : ['1', '3', '5'],  
        'subject' : 'CPEN', 
        'course_number' : '321',
        'location' : 'MCLD'}

## PUT

**\add_friend \ {user_id} \ {friend_id}** : Add a friend with id ```{friend_id}``` to the user with ```{user_id}```. 
      
Note: I think we can skip sending a JSON object because all info needed is passed through the endpoint

## GET


## DELETE


