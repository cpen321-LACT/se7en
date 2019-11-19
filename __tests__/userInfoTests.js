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
   * GET 
   * /user/:userId/info 
   */
  it('get user bad id', async done => {
    
    const response = await request.get('/user/-1/info');
  
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('The user id is less tahn 0 (┛ಠ_ಠ)┛彡┻━┻')
    done()
  })

    /* 
   * BAD
   * GET 
   * /user/:userId/info 
   */
  it('get bad user that doesnt exist', async done => {

    const preferencesBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "5",
      patience : "5",
      hardWorking : "5",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const response = await request.get('/user/200000000/info').send(preferencesBody);
  
    expect(response.status).toBe(400)
    expect(response.body.message).toBe("You are trying to get user info for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻")
    done()
  })


   /* 
   * BAD
   * POST 
   * /user/:userId
   */
  it('Bad info', async done => {

    const infoBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "0",
      patience : "5",
      hardWorking : "5",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const response = await request.post('/user/1').send(infoBody);
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻");
    done()
  })

  /* 
   * BAD
   * POST 
   * /user/:userId
   */
  it('Bad sexes', async done => {

    const preferencesBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "12",
      numberOfRatings : "15",
      kindness : "4",
      patience : "4",
      hardWorking : "4",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const response = await request.post('/user/1').send(preferencesBody);
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("THERE ARE ONLY 2 SEXES (┛ಠ_ಠ)┛彡┻━┻")
    done()
  })

  /* 
   * GOOD
   * POST: /user/:userId
   */
  it('Post User', async done => {

    const preferencesBody = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "5",
      patience : "5",
      hardWorking : "5",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const response = await request.post('/user/3').send(preferencesBody);
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("The user has been added to the database!");
    done();
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

  /* 
   * BAD
   * PUT : /user/:userId/info
   */
  it('Bad PUT user info body', async done => {

    const response = await request.put('/user/1/info');

    expect(response.status).toBe(400);
    expect(response.message).toBe("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻");

    done();
  })

  /* 
   * BAD
   * PUT : /user/:userId/info
   */
  it('Bad PUT user kindness, etc. info', async done => {

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

  /* 
   * BAD
   * PUT : /user/:userId/info
   */
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


  /* 
   * BAD
   * PUT : /user/:userId/info
   */
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
    expect(response.message).toBe("The user with this userId doesn't exists in the database (┛ಠ_ಠ)┛彡┻━┻");

    done();
  })

    /* 
   * GOOD
   * POST : /user/:userId
   * PUT :  /user/:userId/info 
   */
  it('post and put user', async done => {
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

    const response2 = await request.post('/user/11').send(body);

    expect(response2.status).toBe(200);
    expect(response2.body.message).toBe("The user has been added to the database!");

    const body1 = {
        yearLevel : "8888888",
        courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
        sex : "0",
        numberOfRatings : "15",
        kindness : "5",
        patience : "5",
        hardWorking : "5",
        authenticationToken : "abcdef123456789",
        password : "johndoe@123",
        email : "john.doe@gmail.com",
        name : "John Doe"
    };

    const response3 = await request.put('/user/11/info').send(body1);

    expect(response3.status).toBe(200);
    expect(response3.body.message).toBe("The user info has been updated! ヽ(＾Д＾)ﾉ");

    done();
  })

  /* 
   * BAD
   * DELETE : /user/:userId/info
   */
  it('Bad PUT user info body', async done => {

    const response = await request.delete('/user/-2/info');

    expect(response.status).toBe(400);
    expect(response.message).toBe("Invalid userId");

    done();
  })

    /* 
   * GOOD
   * DELETE : /user/:userId/info
   */
  it('Bad PUT user info body', async done => {

    const response = await request.delete('/user/22/info');

    expect(response.status).toBe(200);
    expect(response.message).toBe("deleted the user");

    done();
  })
});