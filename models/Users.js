const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    Date: {
        type: String,
        default: Date.now
    }
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;