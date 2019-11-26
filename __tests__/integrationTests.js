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
 * GOOD
 * POST
 * /user/:userId/preferences
 */
it('Create user and add preferences', async done => {

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

  /*
 * GOOD
 * GET
 * /user/:userId/preferences
 */
it('Create user and retrieve their information', async done => {

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
it('Create a user, add preferences and then change them', async done => {
  
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

});