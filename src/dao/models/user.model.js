const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        index: true,
        unique: true
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    rol: {
        type: String
    }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;