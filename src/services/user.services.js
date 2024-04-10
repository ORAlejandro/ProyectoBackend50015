const UserModel = require("../dao/models/user.model.js");

class UserServices {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }
}

module.exports = UserServices;