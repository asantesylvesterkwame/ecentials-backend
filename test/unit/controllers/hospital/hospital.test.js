/* eslint-disable */
require("dotenv").config();
const sinon = require("sinon");
const mongoose = require("mongoose");
const request = require("supertest");

const Hospital = require("../../../../private/schemas/Hospital");

let app;
let hospital;

beforeAll(async () => {
  const auth = require("../../../../verifyToken");

  sinon.stub(auth, "verify").callsFake((req, res, next) => next());

  app = require("../../../../private/server");

  await mongoose.disconnect();
  await mongoose.connect(process.env.TEST_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Test the hospitals route", () => {
  test("POST /search-for-hospital", async () => {
    hospital = await Hospital.create({
      name: "peace hospital",
      address: "24th street",
      opening_hours: "9am everyday",
      phone_number: "0305678909",
      image: [],
      gps_lat: 59.3293371,
      gps_lng: 13.4877472,
    });

    const data = {
      search_text: "peace",
    };

    return request(app)
      .post("/api/v1/hospitals/search-for-hospital")
      .send(data)
      .expect(200)
      .then((response) => {
        expect(response.body.data[0].name).toBe(hospital.name);
        expect(response.body.data[0].address).toBe(hospital.address);
        expect(response.body.data[0].phone_number).toBe(hospital.phone_number);
      });
  });

  test("POST /search-nearby-hospitals", async () => {
    const data = {
      search_text: "peace",
      user_latitude: 59.3225525,
      user_longitude: 13.4619422,
    };

    return request(app)
      .post("/api/v1/hospitals/search-nearby-hospitals")
      .send(data)
      .expect(200)
      .then((response) => {
        expect(response.body.data[0].name).toBe(hospital.name);
        expect(response.body.data[0].address).toBe(hospital.address);
        expect(response.body.data[0].gps_lat).toBe(hospital.gps_lat);
      });
  });
});
