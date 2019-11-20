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
    //   const du = await request.delete('delete_all_users');
    //   const ds = await request.delete('delete_all_schedules');
    });
  
    afterAll(async () => {
      await connection.close();
    });
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
      /* Post a schedule 100 */
    it('Post schedule 100 event 1', async done => {
      const body = {
           eventId : "1",
           time : "15:00 - 16:30",
           date : "Nov, 18",
           course : "CPEN 321",
           location : "MCLD"
      };
  
      const response = await request.post('/schedule/100').send(body);
    
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Schedule has been posted!! :)');
      done();
    })
    /* Post a empty schedule */
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

    /* Get a schedule 100 */
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
    /* Get a schedule  */
    it('Get a schedule non-exist', async done=> {
      const response = await request.get('/schedule/765/0');
      const mostRecentPost = response.body.length-1;
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("The study event with eventId for user with userId doesn't exist");
      done()
    })
    /* Get all schedule 100 */
    it('Get a all schedule of non-exist', async done=> {
      const response = await request.get('/schedule/766');
      const mostRecentPost = response.body.length-1;
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("The user with userId doesn't have any study events");
      done()
    })

    /* Get all schedule 100 */
  //   it('Get all schedules of 100', async done=> {
  //     const response = await request.get('/schedule/100');
  //     const mostRecentPost = response.body.length-1;
  //     expect(response.status).toBe(200);
  //     expect(response.body[mostRecentPost].userId).toBe(100);
  //     //expect(response.body[mostRecentPost].eventId).toBe(0);
  //     if(response.body[mostRecentPost].eventId == 0){
  //       expect(response.body[mostRecentPost].time).toBe("13:00 - 14:00");
  //       expect(response.body[mostRecentPost].date).toBe("Nov, 17");
  //       expect(response.body[mostRecentPost].course).toStrictEqual("CPEN 321");
  //       expect(response.body[mostRecentPost].location).toBe("MCLD");
  //       // expect(response.body[mostRecentPost-1].eventId).toBe(1);
  //       // expect(response.body[mostRecentPost-1].userId).toBe(100);
  //       // expect(response.body[mostRecentPost-1].time).toBe("15:00 - 16:30");
  //       // expect(response.body[mostRecentPost-1].date).toBe("Nov, 18");
  //       // expect(response.body[mostRecentPost-1].course).toStrictEqual("CPEN 321");
  //       // expect(response.body[mostRecentPost-1].location).toBe("MCLD");
  //     }
  //     else{
  //       expect(response.body[mostRecentPost-1].time).toBe("13:00 - 14:00");
  //       expect(response.body[mostRecentPost-1].date).toBe("Nov, 17");
  //       expect(response.body[mostRecentPost-1].course).toStrictEqual("CPEN 321");
  //       expect(response.body[mostRecentPost-1].location).toBe("MCLD");
  //       expect(response.body[mostRecentPost-1].eventId).toBe(0);
  //       // expect(response.body[mostRecentPost].userId).toBe(100);
  //       // expect(response.body[mostRecentPost].time).toBe("15:00 - 16:30");
  //       // expect(response.body[mostRecentPost].date).toBe("Nov, 18");
  //       // expect(response.body[mostRecentPost].course).toStrictEqual("CPEN 321");
  //       // expect(response.body[mostRecentPost].location).toBe("MCLD");
  //     }
  //     //expect(response.body[mostRecentPost-1].eventId).toBe(1);
  //     // expect(response.body[mostRecentPost-1].time).toBe("15:00 - 16:30");
  //     // expect(response.body[mostRecentPost-1].date).toBe("Nov, 18");
  //     // expect(response.body[mostRecentPost-1].course).toStrictEqual("CPEN 321");
  //     // expect(response.body[mostRecentPost-1].location).toBe("MCLD");
  //     // done()
  // })

    /*____________________________________________________User 101___________________________________________________________ */
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
      expect(response.body[mostRecentPost].time).toBe("17:00 - 18:30");
      expect(response.body[mostRecentPost].date).toBe("Nov, 19");
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
    /* Delete a schedule */
    it('Delete a schedule', async done => {
      const response = await request.delete('/schedule/101/0');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("deleted the specific time");
    })
    /* Delete a schedule */
    it('Delete a non-exist schedule', async done => {
      const response = await request.delete('/schedule/101/4');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("The user with userId doesn't have this schedule");
    })
     /* Delete all schedules */
     it('Delete a schedule', async done => {
      const response = await request.delete('/schedule/100/all/2');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("deleted the schedule");
      const response1 = await request.delete('/schedule/101/all/1');
      expect(response1.status).toBe(200);
      expect(response1.body.message).toBe("deleted the schedule");
    })
    /* Delete non-exist schedules */
    it('Delete a schedule', async done => {
      const response = await request.delete('/schedule/670/all/2');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("The user with userId doesn't have any schedules");
    })
    it('Delete and Get alls', async done =>{
      const res1 = request.get('/get_all_users');
      const res2 = request.get('/get_all_matches'); 
      const res3 = request.get('/get_all_schedules');  
      const res4 = request.get('/get_all_preferences');  
      const response1 =  request.delete('/delete_all_users');
      const response2 =  request.delete('/delete_all_matches');
      const response3 =  request.delete('/delete_all_schedules');
      const response4 =  request.delete('/delete_all_preferences');
      //expect(response1.status).toBe(null);
      //expect(response2.status).toBe(null);
      //expect(response3.status).toBe(null);
    })
});