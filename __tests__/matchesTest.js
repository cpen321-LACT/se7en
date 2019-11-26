const app = require('../REST_API') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)


const {MongoClient} = require('mongodb');

describe('insert', () => {
  let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
    });
  });

  afterAll(async () => {
    await connection.close();
  });



    /* 
   * BAD
   * POST : /user/:userIdA/matches/:userIdB
   */
  it('Bad match themself POST', async done => {
    const event = 
    {
        eventId_a : "0",
        eventId_b : "0"
    }; 
    
    const matchSelfResponse = await request.post('/user/2/matches/2').send(event);

    expect(matchSelfResponse.status).toBe(400);
    expect(matchSelfResponse.body.message).toBe("Cannot match the user with themselves.");

    done();
  })

      /* 
   * BAD
   * POST : /user/:userIdA/matches/:userIdB
   */
  it('Bad match negative POST', async done => {

    const negativeMatchResponse = await request.post('/user/-1/matches/2');

    expect(negativeMatchResponse.status).toBe(400);
    expect(negativeMatchResponse.body.message).toBe("Negative userId");

    done();
  })

        /* 
   * BAD
   * POST : /user/:userIdA/matches/:userIdB
   */
  it('Bad match POST A', async done => {

    const userAWrongResponse = await request.post('/user/1111111/matches/2');

    expect(userAWrongResponse.status).toBe(400);
    expect(userAWrongResponse.body.message).toBe("User A doesn't exist");

    done();
  })

        /* 
   * BAD
   * POST : /user/:userIdA/matches/:userIdB
   */
  it('Bad match POST B', async done => {

    const userBWrongResponse = await request.post('/user/1/matches/2222222');

    expect(userBWrongResponse.status).toBe(400);
    expect(userBWrongResponse.body.message).toBe("User A doesn't exist");

    done();
  })

  /* 
   * BAD
   * GET : /user/:userId/matches/currentlyMatchedWith
   */
  it('Bad no matches GET', async done => {

    const badCurMatchResponse = await request.get('/user/1/matches/currentlyMatchedWith');

    expect(badCurMatchResponse.status).toBe(400);
    expect(badCurMatchResponse.body.message).toBe("The user with userId doesnt have any matches");

    done();
  })

      /* 
   * BAD
   * GET : /user/:userId/matches/currentlyMatchedWith
   */
  it('Bad userId POST', async done => {

    const negativeMatch = await request.get('/user/-1/matches/currentlyMatchedWith');

    expect(negativeMatch.status).toBe(400);
    expect(negativeMatch.body.message).toBe("Negative userId");

    done();
  })

  /* 
   * INTEGRATION TEST:
   * Create 2 users and match them.
   * 
   * GOOD
   * GET : /user/:userId/matches/currentlyMatchedWith
   */
  it('Good user matches GET', async done => {

    /* 
    POST user 40
    POST user 41

    POST user 40 schedule
    POST user 41 schedule

    POST match user 40 with user 41
    POST match user 41 with user 40

    GET matches for user 40
    */

   const u1 = 
   {
     yearLevel : "3",
     courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
     sex : "0",
     numberOfRatings : "15",
     kindness : "4",
     patience : "4",
     hardWorking : "4",
     authenticationToken : "abcdef123456789",
     password : "johndoe@123",
     email : "john.doe@gmail.com",
     name : "Adam Dixon"
   };

   const r1 = await request.post('/user/40').send(u1);
 
   expect(r1.status).toBe(200);
   expect(r1.body.message).toBe("The user has been added to the database!");

   const u2 = 
   {
     yearLevel : "3",
     courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
     sex : "0",
     numberOfRatings : "15",
     kindness : "4",
     patience : "4",
     hardWorking : "4",
     authenticationToken : "abcdef123456789",
     password : "johndoe@123",
     email : "john.doe@gmail.com",
     name : "Adam Dixon"
   };

   const r2 = await request.post('/user/41').send(u2);
 
   expect(r2.status).toBe(200);
   expect(r2.body.message).toBe("The user has been added to the database!");

   const s1 = 
   {
    time : "11:00-12:00",
    date : "Oct.11,2019",
    course : "CPEN321",
    location : "IKB"
   };

   const s2 = 
   {
    time : "11:00-12:00",
    date : "Oct.11,2019",
    course : "CPEN321",
    location : "IKB"
   };

   r3 = await request.post("/schedule/40").send(s1);
   expect(r3.status).toBe(200);
   expect(r3.body.message).toBe("Schedule has been posted!! :)");
   
   
   r4 = await request.post("/schedule/41").send(s2);
   expect(r4.status).toBe(200);
   expect(r4.body.message).toBe("Schedule has been posted!! :)");

   r5 = await request.post('/user/40/matches/41');
   expect(r5.body.message).toBe("Successfully added matches.");
   expect(r5.status).toBe(200);
   
   r6 = await request.post('/user/41/matches/40');
   expect(r6.body.message).toBe("Successfully added matches.");
   expect(r6.status).toBe(200);

   const r7 = await request.get('/user/40/matches/currentlyMatchedWith');

    expect(r7.status).toBe(200);
    expect(r7.body["current_matches"]).toStrictEqual([{"date": "Oct.11,2019", "match": 41, "time": "11:00-12:00"}]);

    done();
  })

});