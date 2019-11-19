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
 * POST
 * /user/:userId/preferences
 */
it('Bad POST user preferences', async done => {
    const nullBodyResponse = await request.post('/user/0/preferences')
  
    expect(nullBodyResponse.status).toBe(400)
    expect(nullBodyResponse.body.message).toBe('The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻')

    const badPreferencesBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "0",
      patience : "0",
      hardWorking : "0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const badPreferencesResponse = await request.post('/user/0/preferences').send(badPreferencesBody);
  
    expect(badPreferencesResponse.status).toBe(400);
    expect(badPreferencesResponse.body.message).toBe('kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻');

    const badPreferencesBody1 = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "12",
      numberOfRatings : "15",
      kindness : "3.4",
      patience : "7.6",
      hardWorking : "1.0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const badPreferencesResponse1 = await request.post('/user/0/preferences').send(badPreferencesBody1);
  
    expect(badPreferencesResponse1.status).toBe(400);
    expect(badPreferencesResponse1.body.message).toBe('THERE ARE ONLY 3 SEXES (FOR PREFERENCES) (┛ಠ_ಠ)┛彡┻━┻');

    const userDoesntExist = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "3.4",
      patience : "7.6",
      hardWorking : "1.0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const badPreferencesResponse2 = await request.post('/user/200000999/preferences').send(userDoesntExist);
  
    expect(badPreferencesResponse2.status).toBe(400);
    expect(badPreferencesResponse2.body.message).toBe('You are posting user preferences for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻');

    done();
  });

/*
 * GOOD
 * POST
 * /user/:userId/preferences
 */
it('Good POST user preferences', async done => {

    const goodPreferencesBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "3.4",
      patience : "7.6",
      hardWorking : "1.0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    /* You need to post a user to the database before you can POST preferences */
    const response = await request.post('/user/2000').send(goodPreferencesBody);
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("The user has been added to the database!");

    const goodBodyResponseA = await request.post('/user/2000/preferences').send(goodPreferencesBody);
  
    expect(goodBodyResponseA.status).toBe(200)
    expect(goodBodyResponseA.body.message).toBe('Preferences have been added. ٩(^ᴗ^)۶')

    done();
});

/*
 * BAD
 * GET
 * /user/:userId/preferences
 */
it('Bad GET user preferences', async done => {

    const response = await request.get('/user/212934836184/preferences');
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("You are trying to GET preferences of a user that doesn't exist in the database (┛ಠ_ಠ)┛彡┻━┻");

    done();
});

/*
 * GOOD
 * GET
 * /user/:userId/preferences
 */
it('Good GET user preferences', async done => {

    const goodPreferencesBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "3.4",
      patience : "7.6",
      hardWorking : "1.0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    /* You need to post a user to the database before you can POST preferences */
    const response = await request.post('/user/2000');
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("The user has been added to the database!");

    const goodBodyResponseB = await request.post('/user/2000/preferences').send(goodPreferencesBody);
  
    expect(goodBodyResponseB.status).toBe(200)
    expect(goodBodyResponseB.body.message).toBe('Preferences have been added. ٩(^ᴗ^)۶')

    const goodGet = await request.get('/user/2000/preferences');
    const mostRecentPost = goodGet.body.length - 1;

    expect(goodGet.status).toBe(200);
    expect(goodGet.body[mostRecentPost].yearLevel).toBe(body.yearLevel);
    expect(goodGet.body[mostRecentPost].courses).toStrictEqual(body.courses);
    expect(goodGet.body[mostRecentPost].sex).toBe(parseInt(body.sex ,10));
    expect(goodGet.body[mostRecentPost].numberOfRatings).toBe(parseInt(body.numberOfRatings, 10));
    expect(goodGet.body[mostRecentPost].kindness).toBe(parseFloat(body.kindness, 10));
    expect(goodGet.body[mostRecentPost].patience).toBe(parseFloat(body.patience, 10));
    expect(goodGet.body[mostRecentPost].hardWorking).toBe(parseFloat(body.hardWorking, 10));
    expect(goodGet.body[mostRecentPost].authenticationToken).toBe(body.authenticationToken);
    expect(goodGet.body[mostRecentPost].password).toBe(body.password);
    expect(goodGet.body[mostRecentPost].email).toBe(body.email);
    expect(goodGet.body[mostRecentPost].name).toBe(body.name);

    done();
});

/*
 * GOOD
 * PUT
 * /user/:userId/preferences
 */
it('Good PUT user preferences', async done => {

    const goodPreferencesBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "3.4",
      patience : "7.6",
      hardWorking : "1.0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    /* You need to post a user to the database before you can POST preferences */
    const response = await request.post('/user/2222');
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("The user has been added to the database!");

    const goodBodyResponseC = await request.post('/user/2222/preferences').send(goodPreferencesBody);
  
    expect(goodBodyResponseC.status).toBe(200)
    expect(goodBodyResponseC.body.message).toBe('Preferences have been added. ٩(^ᴗ^)۶')

    const goodGet = await request.get('/user/2222/preferences');
    const mostRecentPost = goodGet.body.length - 1;

    expect(goodGet.status).toBe(200);
    expect(goodGet.body[mostRecentPost].yearLevel).toBe(body.yearLevel);
    expect(goodGet.body[mostRecentPost].courses).toStrictEqual(body.courses);
    expect(goodGet.body[mostRecentPost].sex).toBe(parseInt(body.sex ,10));
    expect(goodGet.body[mostRecentPost].numberOfRatings).toBe(parseInt(body.numberOfRatings, 10));
    expect(goodGet.body[mostRecentPost].kindness).toBe(parseFloat(body.kindness, 10));
    expect(goodGet.body[mostRecentPost].patience).toBe(parseFloat(body.patience, 10));
    expect(goodGet.body[mostRecentPost].hardWorking).toBe(parseFloat(body.hardWorking, 10));
    expect(goodGet.body[mostRecentPost].authenticationToken).toBe(body.authenticationToken);
    expect(goodGet.body[mostRecentPost].password).toBe(body.password);
    expect(goodGet.body[mostRecentPost].email).toBe(body.email);
    expect(goodGet.body[mostRecentPost].name).toBe(body.name);

    const goodPutPreferencesBodyA = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "3.4",
      patience : "7.6",
      hardWorking : "1.0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@1234",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const goodBodyResponseD = await request.put('/user/2222/preferences').send(goodPutPreferencesBodyA);

    expect(goodBodyResponseD.status).toBe(200);
    expect(goodBodyResponseD.body.message).toBe("Preferences have been updated. ٩(^ᴗ^)۶");

    done();
});

/*
 * BAD
 * PUT
 * /user/:userId/preferences
 */
it('Bad PUT user preferences', async done => {

    const nullBodyResponse = await request.put('/user/22122/preferences');

    expect(nullBodyResponse.status).toBe(400);
    expect(nullBodyResponse.body.message).toBe("you sent a null body (┛ಠ_ಠ)┛彡┻━┻");

    done();
});

/*
 * BAD
 * PUT
 * /user/:userId/preferences
 */
it('Bad PUT user preferences', async done => {
    const badPutPreferencesBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "10000",
      patience : "7.6",
      hardWorking : "1.0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@1234",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const badBodyResponse = await request.put('/user/22122/preferences').send(badPutPreferencesBody);

    expect(badBodyResponse.status).toBe(400);
    expect(badBodyResponse.body.message).toBe("kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻");

    done();
});

/*
 * BAD
 * PUT
 * /user/:userId/preferences
 */
it('Bad PUT user preferences', async done => {
    const goodPutPreferencesBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "3.4",
      patience : "7.6",
      hardWorking : "1.0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@1234",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const r = await request.put('/user/22122/preferences').send(badPutPreferencesBody);

    expect(r.status).toBe(400);
    expect(r.body.message).toBe("You are updating user preferences for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻");

    done();
});
});