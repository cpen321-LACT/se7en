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
   * GET: /user/:userId/info 
   */
  it('get bad user info', async done => {
    const response = await request.get('/user/0/info')
  
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('You are trying to get user info for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻')
    done()
  })

  it('get user does not exist', async done => {
    const response = await request.get('/user/200000000/info')
  
    expect(response.status).toBe(400)
    expect(response.body.message).toBe("You are trying to get user info for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻")
    done()
  })

  /* 
   * BAD
   * POST: /user/:userId
   */
  it('Body with null element', async done => {
    const response = await request.post('/user/1/info')
  
    expect(response.status).toBe(400)
    expect(response.body.message).toBe("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻")
    done()
  })

  it('Bad preferences', async done => {
    const response = await request.post('/user/1/info')
  
    expect(response.status).toBe(400)
    expect(response.body.message).toBe("kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻")
    done()
  })

  it('Bad sexes', async done => {
    const response = await request.post('/user/1/info')
  
    expect(response.status).toBe(400)
    expect(response.body.message).toBe("THERE ARE ONLY 2 SEXES (┛ಠ_ಠ)┛彡┻━┻")
    done()
  })

  /* 
   * GOOD
   * POST: /user/:userId
   */
  it('Post User', async done => {
    const response = await request.post('/user/200')
  
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("The user has been added to the database!")
    done()
  })



  /* 
   * GOOD
   * POST : /user/:userId
   * GET : /user/:userId/info 
   */
  it('post and get user', async done => {
    const body = {
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

    const response2 = await request.post('/user/1').send(body);

    expect(response2.status).toBe(200);
    expect(response2.body.message).toBe("The user has been added to the database!");

    const response = await request.get('/user/1/info');
    const mostRecentPost = response.body.length-1;

    expect(response.status).toBe(200);
    expect(response.body[mostRecentPost].yearLevel).toBe(body.yearLevel);
    expect(response.body[mostRecentPost].courses).toStrictEqual(body.courses);
    expect(response.body[mostRecentPost].sex).toBe(parseInt(body.sex ,10));
    expect(response.body[mostRecentPost].numberOfRatings).toBe(parseInt(body.numberOfRatings, 10));
    expect(response.body[mostRecentPost].kindness).toBe(parseFloat(body.kindness, 10));
    expect(response.body[mostRecentPost].patience).toBe(parseFloat(body.patience, 10));
    expect(response.body[mostRecentPost].hardWorking).toBe(parseFloat(body.hardWorking, 10));
    expect(response.body[mostRecentPost].authenticationToken).toBe(body.authenticationToken);
    expect(response.body[mostRecentPost].password).toBe(body.password);
    expect(response.body[mostRecentPost].email).toBe(body.email);
    expect(response.body[mostRecentPost].name).toBe(body.name);

    done();
  })

  it('Bad user preferences', async done => {
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

    const badPreferencesResponse1 = await request.post('/user/200000999/preferences').send(badPreferencesBody1);
  
    expect(badPreferencesResponse1.status).toBe(400);
    expect(badPreferencesResponse1.body.message).toBe('THERE ARE ONLY 3 SEXES (FOR PREFERENCES) (┛ಠ_ಠ)┛彡┻━┻');

    done();
  });

    /* 
   * BAD
   * PUT : /user/:userId
   */
  it('Bad PUT user info body', async done => {

    const response = await request.put('/user/1/info');

    expect(response.status).toBe(400);
    expect(response.message).toBe("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻");

    done();
  })

  it('Bad PUT user kindness, etc. preferences', async done => {

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

    const response = await request.put('/user/1/info').send(badPreferencesBody);

    expect(response.status).toBe(400);
    expect(response.message).toBe("kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻");

    done();
  })

  it('Bad PUT user info sex', async done => {

    const body = {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "200",
      numberOfRatings : "15",
      kindness : "3.4",
      patience : "7.6",
      hardWorking : "1.0",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
  };

    const response = await request.put('/user/1/info').send(body);

    expect(response.status).toBe(400);
    expect(response.message).toBe("THERE ARE ONLY 2 SEXES (┛ಠ_ಠ)┛彡┻━┻");

    done();
  })

  it('Bad PUT user', async done => {

    const body = {
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

    const response = await request.put('/user/200/info').send(body);

    expect(response.status).toBe(400);
    expect(response.message).toBe("The user with this userId already exists in the database (┛ಠ_ಠ)┛彡┻━┻");

    done();
  })




});




// it('Testing', async done => {
//   const users = db.collection('infoClt');
//   const response = await request.get('/user/1/info')


//   expect(response.status).toBe(200)
//   expect(response.body.message).toBe('The user id is less tahn 0 (┛ಠ_ಠ)┛彡┻━┻')
//   done()
// })

// it('Testing', async done => {
//     const users = db.collection('infoClt');
//     const response = await request.get('/user/0/info')
  
  
//     expect(response.status).toBe(400)
//     expect(response.body.message).toBe('The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻')
//     done()
//   })