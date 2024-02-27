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
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    rol: {
        type: String,
        require: true
    }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;