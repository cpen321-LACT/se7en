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
    /*________________________________________ Post users first____________________________________ */
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
        expect(response.body.userId).toBe(203);
        expect(response.body.eventId).toBe(0);
        expect(response.body.time).toBe("15:00 - 16:30");
        expect(response.body.date).toBe("Nov, 18");
        expect(response.body.wait[0]).toBe("202");
        expect(response.body.wait[1]).toBe("201");
    })
});