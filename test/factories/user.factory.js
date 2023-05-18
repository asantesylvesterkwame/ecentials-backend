const User = require("../../private/schemas/User");

class UserFactory {
  constructor(name, occupation) {
    this.name = name;
    this.occupation = occupation;
  }

  static async create(userfactory) {
    const user = await User.create({
      personal: {
        name: userfactory.name,
        occupation: userfactory.occupation,
      },
      email: "test_email",
      password: "56738euijasdfskajfs",
    });
    return user;
  }
}

module.exports = UserFactory;
