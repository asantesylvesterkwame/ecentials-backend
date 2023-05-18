/* eslint-disable */
const mongoose = require("mongoose");

module.exports = (db_name) => {
  return mongoose.connect(
    `mongodb+srv://ecentials:0Ef1RfIbYghJoKJK@cluster0.k0eejno.mongodb.net/?retryWrites=true&w=majority`,
    () => {
      console.log("MongoDB Connection Successful");
    },
    (e) => console.error(e)
  );

  // return mongoose.connect(
  //   `${process.env.DB_URI}`,
  //   () => {
  //     console.log("MongoDB Connection Successful");
  //   },
  //   (e) => console.error(e)
  // );
  // return mongoose.connect(
  //   `mongodb://localhost/${db_name}`,
  //   () => {
  //     console.log("MongoDB Connection Successful");
  //   },
  //   (e) => console.error(e)
  // );
};
