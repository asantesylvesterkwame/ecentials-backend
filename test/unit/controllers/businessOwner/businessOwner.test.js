/* eslint-disable */
require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const BusinessOwner = require("../../../../private/schemas/BusinessOwner");

let app;

beforeAll(async () => {
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

describe("Test business owner controllers", () => {
  test("POST /create-business-owner should create new business owner", async () => {
    const data = {
      full_name: "Kumi Guitar",
      email: "kumi@gmail.com",
      password: "#nevermindKumi2013",
      phone_number: "345678932",
      address: "27th street, Dansoman",
    };

    return request(app)
      .post("/api/v1/business-owner/create-business-owner")
      .send(data)
      .expect(200)
      .then(async (response) => {
        const owners = await BusinessOwner.find({ email: data.email });
        expect(response.body.data.full_name).toBe(owners[0].full_name);
        expect(response.body.data.email).toBe(owners[0].email);
        expect(response.body.data.phone_number).toBe(owners[0].phone_number);
      });
  });
});
