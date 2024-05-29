const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Register User
// @route POST /api/user/register
// @access public
const userRegister = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		res.status(400);
		throw new Error("All fields are mandatory!");
	}
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("User with this email already exists!");
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({
		username,
		email,
		password: hashedPassword,
	});
	if (user) {
		res.status(201).json({ _id: user.id, email: user.email });
	} else {
		res.status(400);
		throw new Error("Invalid user data!");
	}
});

// @desc Login User
// @route POST /api/user/login
// @access public
const userLogin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error("All fields are mandatory!");
	}
	const user = await User.findOne({ email });
	if (user && (await bcrypt.compare(password, user.password))) {
		const accessToken = jwt.sign(
			{
				user: {
					username: user.username,
					email: user.email,
					id: user.id,
				},
			},
			process.env.ACCESS_TOKEN_SECERT,
			{ expiresIn: "15m" }
		);
		res.status(201).json({ accessToken });
	} else {
		res.status(401);
		throw new Error("Invalid email or password!");
	}
});

// @desc Get user contacts
// @route GET /api/user/current
// @access private
const userCurrent = asyncHandler(async (req, res) => {
	res.status(200).json(req.user);
});

module.exports = { userRegister, userLogin, userCurrent };
