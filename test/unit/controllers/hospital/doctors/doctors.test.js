require('dotenv').config();
const sinon = require("sinon");
const mongoose = require("mongoose")
const request = require('supertest');
const User = require('../../../../../private/schemas/User');
const Ratings = require('../../../../../private/schemas/Ratings');
const Staff = require('../../../../../private/schemas/Staff');
const UserFactory = require('../../../../factories/user.factory');
const HospitalFactory = require('../../../../factories/hospital.factory');
const StaffFactory = require('../../../../factories/staff.factory');
const RatingsFactory = require('../../../../factories/ratings.factory');

var app;

beforeAll(async () => {

    const auth = require('../../../../../verifyToken');

    sinon.stub(auth, 'verify')
        .callsFake(function (req, res, next) {
            return next();
        })

    app = require('../../../../../private/server')

    await mongoose.disconnect()
    await mongoose.connect(process.env.TEST_DB_URI,
                           {useNewUrlParser: true, useUnifiedTopology: true });

})


afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});


describe("Test the doctor endpoints", () => {
    test("POST /get-doctor-reviews", async () => {
        let user_factory = new UserFactory("kumi", "farmer")
        let user = await UserFactory.create(user_factory)
        
        let hospital_factory = new HospitalFactory("Peace", "27th street", "8 am", "4566789")
        let hospital = await HospitalFactory.create(hospital_factory)
        
        
        let staff_factory = new StaffFactory(hospital._id, "hospital", "Jones", "general doctor", "doctor", "jimmyJone")
        let doctor = await StaffFactory.create(staff_factory)

        let review_factory = new RatingsFactory(user._id, doctor._id, "doctor", "best doctor", 4)
        let review = await RatingsFactory.create(review_factory)
        
        const data = {
            "recipient_id": doctor._id,
            "recipient_type": staff_factory.staff_type
        }
        console.log(data)
        return request(app)
            .post("/api/v1/hospital/staffs/get-doctor-reviews")
            .send(data)
            .expect(200)
            .then((response) => {
                console.log(review);
                console.log(response.body)
                expect(response.body.data[0].rating).toBe(review_factory.rating)
                expect(response.body.data[0].message).toBe(review_factory.message)
                expect(response.body.data[0].reviewer_name).toBe(user_factory.name)
            })

    })
})