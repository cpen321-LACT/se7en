const app = require('../REST_API') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

jest.setTimeout(10000);


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

  const infoBod = 
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
    name : "John Doe"
  };

    const user31Response = await request.post('/user/31').send(infoBod);
  
    expect(user31Response.status).toBe(200)
    expect(user31Response.body.message).toBe('The user has been added to the database!');

    const badPreferencesBody = 
    {
      userId : "31",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      kindness : "1111",
      patience : "0",
      hardWorking : "0",
      yearLevel : "3",
      sex : "1"
    };

    const badPreferencesResponse = await request.post('/user/31/preferences').send(badPreferencesBody);
  
    expect(badPreferencesResponse.status).toBe(400);
    expect(badPreferencesResponse.body.message).toBe('kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻');

    const badPreferencesBody1 = 
    {
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      kindness : "4",
      patience : "4",
      hardWorking : "4",
      yearLevel : "3",
      sex : "1123"
    };

    const badPreferencesResponse1 = await request.post('/user/31/preferences').send(badPreferencesBody1);
  
    expect(badPreferencesResponse1.status).toBe(400);
    expect(badPreferencesResponse1.body.message).toBe('THERE ARE ONLY 3 SEXES (FOR PREFERENCES) (┛ಠ_ಠ)┛彡┻━┻');

    const userDoesntExist = 
    {
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      kindness : "4",
      patience : "4",
      hardWorking : "4",
      yearLevel : "3",
      sex : "1"
    };

    const badPreferencesResponse2 = await request.post('/user/1235432345/preferences').send(userDoesntExist);
  
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

  const infoBod32 = 
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
    name : "John Doe"
  };

    const user32Response = await request.post('/user/31').send(infoBod32);
  
    expect(user32Response.status).toBe(200)
    expect(user32Response.body.message).toBe('The user has been added to the database!');

    const goodRequestPrefBod = 
    {
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      kindness : "4",
      patience : "4",
      hardWorking : "4",
      yearLevel : "3",
      sex : "1"
    };

    const goodBodyResponseA = await request.post('/user/31/preferences').send(goodRequestPrefBod);
  
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

    const infoBod33 = 
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
      name : "John Doe"
    };

    /* You need to post a user to the database before you can POST preferences */
    const response = await request.post('/user/33').send(infoBod33);
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("The user has been added to the database!");

    const goodRequestPrefBod33 = 
    {
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      kindness : "4",
      patience : "4",
      hardWorking : "4",
      yearLevel : "3",
      sex : "1"
    };

    const goodBodyResponseB = await request.post('/user/33/preferences').send(goodRequestPrefBod33);
  
    expect(goodBodyResponseB.status).toBe(200)
    expect(goodBodyResponseB.body.message).toBe('Preferences have been added. ٩(^ᴗ^)۶')

    const goodGet = await request.get('/user/33/preferences');
    const mostRecentPost3 = goodGet.body.length - 1;

    expect(goodGet.status).toBe(200);
    expect(goodGet.body[mostRecentPost3].yearLevel).toBe(goodRequestPrefBod33.yearLevel);
    expect(goodGet.body[mostRecentPost3].courses).toStrictEqual(goodRequestPrefBod33.courses);
    expect(goodGet.body[mostRecentPost3].sex).toBe(parseInt(goodRequestPrefBod33.sex ,10));
    expect(goodGet.body[mostRecentPost3].kindness).toBe(parseFloat(goodRequestPrefBod33.kindness, 10));
    expect(goodGet.body[mostRecentPost3].patience).toBe(parseFloat(goodRequestPrefBod33.patience, 10));
    expect(goodGet.body[mostRecentPost3].hardWorking).toBe(parseFloat(goodRequestPrefBod33.hardWorking, 10));

    done();
});

/*
 * GOOD
 * PUT
 * /user/:userId/preferences
 */
it('Good PUT user preferences', async done => {
  
  const infoBod34 = 
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
    name : "John Doe"
  };
    /* You need to post a user to the database before you can POST preferences */
    const response = await request.post('/user/34').send(infoBod34);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("The user has been added to the database!");

    const goodRequestPrefBod34 = 
    {
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      kindness : "4",
      patience : "4",
      hardWorking : "4",
      yearLevel : "3",
      sex : "1"
    };

    const goodBodyResponseC = await request.post('/user/34/preferences').send(goodRequestPrefBod34);
  
    expect(goodBodyResponseC.status).toBe(200)
    expect(goodBodyResponseC.body.message).toBe('Preferences have been added. ٩(^ᴗ^)۶')

    const goodGet = await request.get('/user/34/preferences');
    const mostRecentPost5 = goodGet.body.length - 1;

    expect(goodGet.status).toBe(200);
    expect(goodGet.body[mostRecentPost5].yearLevel).toBe(goodRequestPrefBod34.yearLevel);
    expect(goodGet.body[mostRecentPost5].courses).toStrictEqual(goodRequestPrefBod34.courses);
    expect(goodGet.body[mostRecentPost5].sex).toBe(parseInt(goodRequestPrefBod34.sex ,10));
    expect(goodGet.body[mostRecentPost5].kindness).toBe(parseFloat(goodRequestPrefBod34.kindness, 10));
    expect(goodGet.body[mostRecentPost5].patience).toBe(parseFloat(goodRequestPrefBod34.patience, 10));
    expect(goodGet.body[mostRecentPost5].hardWorking).toBe(parseFloat(goodRequestPrefBod34.hardWorking, 10));

    const goodRequestPrefBod34Put = 
    {
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311' ,'ELEC 221'],
      kindness : "3",
      patience : "5",
      hardWorking : "4",
      yearLevel : "3",
      sex : "0"
    };

    const goodBodyResponseD = await request.put('/user/34/preferences').send(goodRequestPrefBod34Put);

    expect(goodBodyResponseD.status).toBe(200);
    expect(goodBodyResponseD.body.message).toBe("Preferences have been updated. ٩(^ᴗ^)۶");

    const goodPut = await request.get('/user/34/preferences');
    const mostRecentPost6 = goodGet.body.length - 1;

    expect(goodPut.status).toBe(200);
    expect(goodPut.body[mostRecentPost6].yearLevel).toBe(goodRequestPrefBod34.yearLevel);
    expect(goodPut.body[mostRecentPost6].courses).toStrictEqual(goodRequestPrefBod34.courses);
    expect(goodPut.body[mostRecentPost6].sex).toBe(parseInt(goodRequestPrefBod34.sex ,10));
    expect(goodPut.body[mostRecentPost6].kindness).toBe(parseFloat(goodRequestPrefBod34.kindness, 10));
    expect(goodPut.body[mostRecentPost6].patience).toBe(parseFloat(goodRequestPrefBod34.patience, 10));
    expect(goodPut.body[mostRecentPost6].hardWorking).toBe(parseFloat(goodRequestPrefBod34.hardWorking, 10));

    done();
});

/*
 * BAD
 * PUT
 * /user/:userId/preferences
 */
it('Bad PUT user preferences', async done => {

    const nullBod = {};

    const nullBodyResponse = await request.put('/user/22122/preferences').send(nullBod);

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

  const badRequestPrefBod35Put = 
  {
    courses : ['CPEN 321', 'CPEN 331', 'CPEN 311'],
    kindness : "3",
    patience : "123134",
    hardWorking : "4",
    yearLevel : "3",
    sex : "0"
  };

    const badBodyResponse = await request.put('/user/35/preferences').send(badRequestPrefBod35Put);

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

  const goodBoduwu = 
  {
    courses : ['CPEN 321', 'CPEN 331', 'CPEN 311'],
    kindness : "3",
    patience : "5",
    hardWorking : "4",
    yearLevel : "3",
    sex : "0"
  };

    const noUserRes = await request.put('/user/351234/preferences').send(goodBoduwu);

    expect(noUserRes.status).toBe(400);
    expect(noUserRes.body.message).toBe("You are updating user preferences for a user that does not exist in the database (┛ಠ_ಠ)┛彡┻━┻");

    done();
});

  /* 
   * BAD
   * GET 
   * /user/:userId/info 
   */
  it('get user bad id', async done => {
    
    const response = await request.get('/user/-1/info');
  
    await expect(response.status).toBe(400)
    await expect(response.body.message).toBe('The user id is less tahn 0 (┛ಠ_ಠ)┛彡┻━┻')
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

    const infoB = 
    {
      yearLevel : "8888888",
      courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
      sex : "0",
      numberOfRatings : "15",
      kindness : "4",
      patience : "4",
      hardWorking : "4",
      authenticationToken : "abcdef123456789",
      password : "johndoe@123",
      email : "john.doe@gmail.com",
      name : "John Doe"
    };

    const response = await request.post('/user/3').send(infoB);
  
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
    const bodyh = {
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

    const response2 = await request.post('/user/1').send(bodyh);

    expect(response2.status).toBe(200);
    expect(response2.body.message).toBe("The user has been added to the database!");

    const response = await request.get('/user/1/info');
    const mostRecentPost = response.body.length-1;

    expect(response.status).toBe(200);
    expect(response.body[mostRecentPost].yearLevel).toBe(bodyh.yearLevel);
    expect(response.body[mostRecentPost].courses).toStrictEqual(bodyh.courses);
    expect(response.body[mostRecentPost].sex).toBe(parseInt(bodyh.sex ,10));
    expect(response.body[mostRecentPost].numberOfRatings).toBe(parseInt(bodyh.numberOfRatings, 10));
    expect(response.body[mostRecentPost].kindness).toBe(parseFloat(bodyh.kindness, 10));
    expect(response.body[mostRecentPost].patience).toBe(parseFloat(bodyh.patience, 10));
    expect(response.body[mostRecentPost].hardWorking).toBe(parseFloat(bodyh.hardWorking, 10));
    expect(response.body[mostRecentPost].authenticationToken).toBe(bodyh.authenticationToken);
    expect(response.body[mostRecentPost].password).toBe(bodyh.password);
    expect(response.body[mostRecentPost].email).toBe(bodyh.email);
    expect(response.body[mostRecentPost].name).toBe(bodyh.name);

    done();
  })

  /* 
   * BAD
   * PUT : /user/:userId/info
   */
  it('Bad PUT user info body', async done => {

    const bod = {
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
    };

    const response12345 = await request.post('/user/12345').send(bod);
    expect(response12345.status).toBe(200);
    expect(response12345.body.message).toBe("The user has been added to the database!");


    const wain1 = await request.put('/user/12345/info').send({});
    expect(wain1.status).toBe(400);
    // expect(wain1.message).toBe("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻");

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

    const response = await request.put('/user/1111/info').send(badPreferencesBody);

    expect(response.status).toBe(400);
    // expect(response.message).toBe("kindness, patience and hardWorking do not add up to 12 (┛ಠ_ಠ)┛彡┻━┻");

    done();
  })

   /* 
   * BAD
   * PUT : /user/:userId/info
   */
  it('Bad PUT user info sex', async done => {

    const body122 = {
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

    const response = await request.put('/user/121/info').send(body122);

    expect(response.status).toBe(400);
    // expect(response.message).toBe("THERE ARE ONLY 2 SEXES (┛ಠ_ಠ)┛彡┻━┻");

    done();
  })


  /* 
   * BAD
   * PUT : /user/:userId/info
   */
  it('Bad PUT user', async done => {

    const bodyy = {
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

    const response = await request.put('/user/200/info').send(bodyy);

    expect(response.status).toBe(400);
    // expect(response.message).toBe("The user with this userId doesn't exists in the database (┛ಠ_ಠ)┛彡┻━┻");

    done();
  })

    /* 
   * GOOD
   * POST : /user/:userId
   * PUT :  /user/:userId/info 
   */
  it('post and put user', async done => {
    const bodey = {
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

    const response2 = await request.post('/user/11').send(bodey);

    expect(response2.status).toBe(200);
    expect(response2.body.message).toBe("The user has been added to the database!");

    const body1 = {
        yearLevel : "8888888",
        courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
        sex : "0",
        numberOfRatings : "15",
        kindness : "4",
        patience : "4",
        hardWorking : "4",
        authenticationToken : "abcdef123456789",
        password : "johndoe@123",
        email : "john.doe@gmail.com",
        name : "John Doe"
    };

    const response3 = await request.put('/user/11/info').send(body1);

    expect(response3.body.message).toBe("The user info has been updated! ヽ(＾Д＾)ﾉ");
    expect(response3.status).toBe(200);
    

    done();
  })

  /* 
   * BAD
   * DELETE : /user/:userId/info
   */
  it('Bad DELETE user', async done => {

    const ress = await request.delete('/user/-2/info');

    expect(ress.body.message).toBe("Invalid userId");
    expect(ress.status).toBe(400);

    done();
  })

    /* 
   * GOOD
   * DELETE : /user/:userId/info
   */
  it('Good DELETE user', async done => {

    const response = await request.delete('/user/22/info');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("deleted the user");

    done();
  })


  /*
   * INTEGRATION TEST
   * Adding a schedule event use case...
   */
  it('Adding to schedule use case integration test', async done => {

    const userBody = {
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

    /* Create a user (sign up) */
    const user1 = await request.post('/user/1111').send(userBody);
    expect(user1.status).toBe(200);
    expect(user1.body.message).toBe("The user has been added to the database!");

    const schedule1 = 
    {
     userId : "40",
     eventId : "0",
     time : "11:00-12:00",
     date : "Oct.11,2019",
     course : "CPEN321",
     location : "IKB"
    };

    /* Add a study event */
    const postSchedule = await request.post("/schedule/1111").send(schedule1);
    // expect(postSchedule.status).toBe(200);
    expect(postSchedule.body.message).toBe("Schedule has been posted!! :)");

    /* Get the schedule to make sure it was POSTed correctly */
    const checkProperStudyEvent = await request.get("/schedule/1111");
    expect(checkProperStudyEvent.status).toBe(200);
    const mRP = checkProperStudyEvent.body.length-1;
    expect(checkProperStudyEvent.body[mRP].eventId).toBe(parseInt(schedule1.eventId, 10));
    expect(checkProperStudyEvent.body[mRP].time).toBe(schedule1.time);
    expect(checkProperStudyEvent.body[mRP].date).toBe(schedule1.date);
    expect(checkProperStudyEvent.body[mRP].course).toBe(schedule1.course);
    expect(checkProperStudyEvent.body[mRP].location).toBe(schedule1.location);

    done();
  })

  /* Post an user first */
  it('Post User', async done => {
    const body = {
        yearLevel : "100",
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
    const response = await request.post('/user/100').send(body);
  
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("The user has been added to the database!")
    done()
  })
  it('Post User', async done => {
    const body = {
        yearLevel : "100",
        courses : ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
        sex : "0",
        numberOfRatings : "15",
        kindness : "3.4",
        patience : "7.6",
        hardWorking : "1.0",
        authenticationToken : "abcdef123456789",
        password : "johndoe@123",
        email : "john.doe@gmail.com",
        name : "John EoD"
    };    
    const response = await request.post('/user/101').send(body);
  
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("The user has been added to the database!")
    done()
  })
/*____________________________________________________User 100___________________________________________________________ */
/* Post a schedule 100  */
it('Post schedule 100 event 0', async done => {
    const body = {
         eventId : "0",
         time : "13:00 - 14:00",
         date : "Nov, 17",
         course : "CPEN 321",
         location : "MCLD"
    };

    const response = await request.post('/schedule/100').send(body);
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Schedule has been posted!! :)');
    done();
  })

  it('Post schedule 100 event 0', async done => {
    const body1 = {
      yearLevel : "100",
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
  const response1 = await request.post('/user/100').send(body1);

  expect(response1.status).toBe(200)
  expect(response1.body.message).toBe("The user has been added to the database!")
  const body2 = {
       eventId : "0",
       time : "13:00 - 14:00",
       date : "Nov, 17",
       course : "CPEN 321",
       location : "MCLD"
  };
  const response2 = await request.post('/schedule/100').send(body2);

  expect(response2.status).toBe(200);
  expect(response2.body.message).toBe('Schedule has been posted!! :)');
  done();
    
})

it('Post a null schedule', async done => {
  const body = {    };

  const response = await request.post('/schedule/100').send(body);

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("The body sent has a null element (┛ಠ_ಠ)┛彡┻━┻");
  done();
})

    /* Post a non exist person's schedule */
    it('Post schedule to non exist person', async done => {
      const body = {
           eventId : "0",
           time : "13:00 - 14:00",
           date : "Nov, 17",
           course : "CPEN 321",
           location : "MCLD"
      };
  
      const response = await request.post('/schedule/333').send(body);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("You are trying to post a schedule to a user that doesnt exist (┛ಠ_ಠ)┛彡┻━┻");
      done();
    })

    it('Get the schedule of 100', async done=> {
      const response = await request.get('/schedule/100/0');
      const mostRecentPost = response.body.length-1;
      expect(response.status).toBe(200);
      expect(response.body[mostRecentPost].userId).toBe(100);
      expect(response.body[mostRecentPost].eventId).toBe(0);
      expect(response.body[mostRecentPost].time).toBe("13:00 - 14:00");
      expect(response.body[mostRecentPost].date).toBe("Nov, 17");
      expect(response.body[mostRecentPost].course).toStrictEqual("CPEN 321");
      expect(response.body[mostRecentPost].location).toBe("MCLD");
      done()
  })
      /* Post a schedule 101 */
      it('Post schedule 101', async done => {
        const body = {
             eventId : "0",
             time : "13:00 - 14:00",
             date : "Nov, 17",
             course : "CPEN 321",
             location : "MCLD"
        };
    
        const response = await request.post('/schedule/101').send(body);
      
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Schedule has been posted!! :)');
        done();
      })


    /* Get a schedule 101 */
    it('Get the schedule of 101', async done=> {
        const response = await request.get('/schedule/101/0');
        const mostRecentPost = response.body.length-1;
        expect(response.status).toBe(200);
        expect(response.body[mostRecentPost].userId).toBe(101);
        expect(response.body[mostRecentPost].eventId).toBe(0);
        expect(response.body[mostRecentPost].time).toBe("13:00 - 14:00");
        expect(response.body[mostRecentPost].date).toBe("Nov, 17");
        expect(response.body[mostRecentPost].course).toStrictEqual("CPEN 321");
        expect(response.body[mostRecentPost].location).toBe("MCLD");
        done()
    })

    /* Get a non exist schedule 1000 */
    it('Get the schedule of 100', async done=> {
      const response = await request.get('/schedule/1000/0');
      const mostRecentPost = response.body.length-1;
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("The study event with eventId for user with userId doesn't exist");
      done()
    })

    /* Put a schedule 101 */
    it('Put schedule 101', async done => {
      const body = {
        time : "17:00 - 18:30",
        date : "Nov, 19",
        course : "CPEN 321",
        location : "MCLD"
      };
      const response = await request.put('/schedule/101/0').send(body);
    
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Schedules have been updated.");
      done();
    })
    /* Get a schedule 101 after update */
    it('Get the schedule of 101 after update', async done=> {
      const response = await request.get('/schedule/101/0');
      const mostRecentPost = response.body.length-1;
      expect(response.status).toBe(200);
      expect(response.body[mostRecentPost].userId).toBe(101);
      expect(response.body[mostRecentPost].eventId).toBe(0);
      // expect(response.body[mostRecentPost].time).toBe("17:00 - 18:30");
      // expect(response.body[mostRecentPost].date).toBe("Nov, 19");
      expect(response.body[mostRecentPost].course).toStrictEqual("CPEN 321");
      expect(response.body[mostRecentPost].location).toBe("MCLD");
      done()
    })

    /* Put a empty body */
    it('Put empty schedule 101', async done => {
      const body = {};
      const response = await request.put('/schedule/101/0').send(body);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("(┛ಠ_ಠ)┛彡┻━┻");
      done();
    })
    /* Put a empty body */
    it('Put a empty schedule 101', async done => {
      const response = await request.put('/schedule/101/0');
    
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("(┛ಠ_ಠ)┛彡┻━┻");
      done();
    })

    it('Post User 1', async done => {
      const body = {
          yearLevel : "100",
          courses : ['CPEN321', 'CPEN331', 'CPEN311', 'ELEC221'],
          sex : "0",
          numberOfRatings : "15",
          kindness : "4.0",
          patience : "3.0",
          hardWorking : "5.0",
          authenticationToken : "abcdef123456789",
          password : "johndoe@123",
          email : "john.doe@gmail.com",
          name : "Adam"
      };    
      const response = await request.post('/user/203').send(body);
    
      expect(response.status).toBe(200)
      expect(response.body.message).toBe("The user has been added to the database!")
      done()
    })
    it('Post User 2', async done => {
      const body = {
          yearLevel : "100",
          courses : ['CPEN321', 'CPEN331', 'CPEN311', 'ELEC221'],
          sex : "0",
          numberOfRatings : "15",
          kindness : "0.0",
          patience : "1.0",
          hardWorking : "11.0",
          authenticationToken : "abcdef123456789",
          password : "johndoe@123",
          email : "john.doe@gmail.com",
          name : "John"
      };    
      const response = await request.post('/user/201').send(body);
    
      expect(response.status).toBe(200)
      expect(response.body.message).toBe("The user has been added to the database!")
      done()
    })
    it('Post User 3', async done => {
      const body = {
          yearLevel : "100",
          courses : ['CPEN321', 'CPEN331', 'CPEN311', 'ELEC221'],
          sex : "0",
          numberOfRatings : "15",
          kindness : "4.0",
          patience : "4.0",
          hardWorking : "4.0",
          authenticationToken : "abcdef123456789",
          password : "johndoe@123",
          email : "john.doe@gmail.com",
          name : "John"
      };    
      const response = await request.post('/user/202').send(body);
    
      expect(response.status).toBe(200)
      expect(response.body.message).toBe("The user has been added to the database!")
      done()
    })
    /*____________________________________Post their schedules_____________________________________ */
    /*
     * Assume they all have the same schedules 
     */
     /* Post a schedule 203 */
  it('Post schedule 203 event 0', async done => {
      const body = {
           eventId : "0",
           time : "15:00 - 16:30",
           date : "Nov, 18",
           course : "CPEN321",
           location : "MCLD"
      };
  
      const response = await request.post('/schedule/203').send(body);
    
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Schedule has been posted!! :)');
      done();
    })
     /* Post a schedule 201 */
     it('Post schedule 203 event 0', async done => {
      const body = {
           eventId : "0",
           time : "15:00 - 16:30",
           date : "Nov, 18",
           course : "CPEN321",
           location : "MCLD"
      };
  
      const response = await request.post('/schedule/203').send(body);
    
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Schedule has been posted!! :)');
      done();
    })
       /* Post a schedule 202 */
  it('Post schedule 203 event 0', async done => {
      const body = {
           eventId : "0",
           time : "15:00 - 16:30",
           date : "Nov, 18",
           course : "CPEN321",
           location : "MCLD"
      };
  
      const response = await request.post('/schedule/203').send(body);
    
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Schedule has been posted!! :)');
      done();
    })
    /*____________________________________Post their preferences_____________________________________ */
    it('Post preference 203', async done => {
      const body = {
          "kindness"     : "4.0",
          "patience"     : "4.0",
          "hardWorking" : "4.0",
          "courses"      : "CPEN321",
          "sex"          : "1",
          "yearLevel"   : "3"
      };
  
      const response = await request.post('/user/203/preferences').send(body);
    
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Preferences have been added. ٩(^ᴗ^)۶");
      done();
    })
  //   it('Post preference 201', async done => {
  //     const body = {
  //         "kindness"     : "4",
  //         "patience"     : "4",
  //         "hardWorking" : "4",
  //         "courses"      : "CPEN 321",
  //         "sex"          : "1",
  //         "yearLevel"   : "3"
  //     };
  
  //     const response = await request.post('/user/201/preferences').send(body);
    
  //     expect(response.status).toBe(200);
  //     expect(response.body.message).toBe("Preferences have been added. ٩(^ᴗ^)۶");
  //     done();
  //   })
  //   it('Post preference 202', async done => {
  //     const body = {
  //         "kindness"     : "4",
  //         "patience"     : "4",
  //         "hardWorking" : "4",
  //         "courses"      : "CPEN 321",
  //         "sex"          : "1",
  //         "yearLevel"   : "3"
  //     };
  
  //     const response = await request.post('/user/202/preferences').send(body);
    
  //     expect(response.status).toBe(200);
  //     expect(response.body.message).toBe("Preferences have been added. ٩(^ᴗ^)۶");
  //     done();
  //   })

  /*_____________________________The non-trivial logic matching_________________________ */
  it('Generate and get matches for user 203', async done =>{
      const response = await request.get("/user/200/matches/potentialMatches/0/CPEN321");
      expect(response.status).toBe(200);
      // expect(response.body.userId).toBe(203);
      // expect(response.body.eventId).toBe(0);
      // expect(response.body.time).toBe("15:00 - 16:30");
      // expect(response.body.date).toBe("Nov, 18");
      // expect(response.body.wait[0]).toBe("202");
      // expect(response.body.wait[1]).toBe("201");
      done();
  })
  /* Delete a schedule */
  it('Delete a non-exist schedule', async done => {
    const response = await request.delete('/schedule/101/4');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The user with userId doesn't have this schedule");
    done();
  })
   /* Delete all schedules */
   it('Delete a schedule', async done => {
    const response = await request.delete('/schedule/100/all/2');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("deleted the schedule");
    const response1 = await request.delete('/schedule/101/all/1');
    expect(response1.status).toBe(200);
    expect(response1.body.message).toBe("deleted the schedule");
    done();
  })
  /* Delete non-exist schedules */
  it('Delete a schedule', async done => {
    const response = await request.delete('/schedule/670/all/2');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The user with userId doesn't have any schedules");
    done();
  })
});