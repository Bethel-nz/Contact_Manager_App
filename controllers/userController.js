const asyncHandler = require('express-async-handler');
const User = require('../db/models/userModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let accessToken;
//@desc: Register a User
//route: POST /api/users/register
//@access: public
const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		res.status(400);
		throw new Error(`All fields are mandatory`)
	}
	const userAvailable = await User.findOne({ email })
	if (userAvailable) {
		res.status(400);
		throw new Error(`User already registered`);
	}
	//hash password
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = User.create({
		username, email, password: hashedPassword
	})
	if (user) {
		res.status(201).json({ _id: user.id, email: user.email })
	} else {
		res.status(400);
		throw new Error(`User data is not valid`)
	}
	res.status(200).json({ message: `register a user` })
})

//@desc: Login a User
//route: POST /api/users/login
//@access: public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error(`All fields are mandatory`);
	}
	const user = await User.findOne({ email });
	if (user && (await bcrypt.compare(password, user.password))) {
		accessToken = jwt.sign({
			user: {
				username: user.username,
				email: user.email,
				id: user.id
			}
		}, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "15m"
		})
		req.headers.authorization = `Bearer ${accessToken}`;
		console.log(accessToken)
		res.send(`You have successfully registered`)
	} else {
		res.status(401);
		throw new Error(`Password is not valid`)
	}
})

//@desc: Current user information
//route: POST /api/users/user
//@access: private
const getUser = asyncHandler(async (req, res) => {
	req.headers.authorization = `Bearer ${accessToken}`;
	console.log(req.headers)
	res.status(200).json(req.user)
})

module.exports = { registerUser, loginUser, getUser }