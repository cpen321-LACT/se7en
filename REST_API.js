/*
* GET endpoints 
*/ 

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
 */
app.get('/user/{user_id}/matches', (req,res) => {
})

/*
 * Get the user with user_id's schedule.
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
 * TODO: Implement this function.
 */
app.get('/schedule/{user_id}', (req,res) => {
})

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
 * TODO: Write error checking code.
 * TODO: Implement this function.
 */
app.get('/user/{user_id}/info', (req,res) => {
})

/*
 * Get the preferences of the user with user_id.
 *
 * Below is a sample JSON output:
 * 
 * {'user_id' : '0', 
 *  'kindness' : '2', 
 *  'patience' : '6'
 *  'hard_working' : '4', 
 *  'courses' : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221', ...], 
 *  'sex' : ['Male', 'Female'],
 *  'year_level' : [‘3’, ‘4’, ...]}
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function.
 */
app.get('/user/{user_id}/preferences', (req,res) => {
})

/*
* POST endpoints 
*/ 

/*
 * Sign up a new user.
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 */
app.post('/user/{user_id}/sign_up', (req,res) => {
})

/*
* PUT endpoints 
*/ 

/*
 * Update the information of user with user_id's information.
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 */
app.put('/user/{user_id}/info', (req,res) => {
})

/*
 * Update the schedule of the user with with user_id.
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 */
app.put('/schedule/{user_id}', (req,res) => {
})


/*
 * Update the preferences of the user with user_id.
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 */
app.put('/user/{user_id}/preferences', (req,res) => {
})


/*
 * Match user with user_id user_id_a with user with user_id user_id_b and vice versa.
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 */
app.put('/user/{user_id_a}/matches/{user_id_b}', (req,res) => {
})

/*
* DELETE endpoints 
*/ 

/*
 * Delete a study event with event_id of the user with user_id. 
 * !! We will need to find a way to differentiate between study events. !!
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 */
app.delete('/user/{user_id}/schedule/{event_id}', (req,res) => {
})

/*
 * Unmatch user with user_id with user with match_id and vice versa.
 * 
 * TODO: Write error checking code.
 * TODO: Implement this function. 
 */
app.delete('/user/{user_id}/matches/{match_id}', (req,res) => {
})