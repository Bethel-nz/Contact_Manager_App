const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: [true, "Please enter a username"]
	},
	email: {
		type: String,
		required: [true, 'please enter the user email address'],
		unique: [true, "Email exist already"]
	},
	password: {
		type: String,
		required: [true, 'please eneter a valid password']
	}
}, {
	timestamp: true
})

module.exports = mongoose.model("User", userSchema)

