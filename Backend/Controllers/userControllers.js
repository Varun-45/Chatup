const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const generateToken = require("../token")
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, profile } = req.body;
    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Please Enter all the fields")
    }
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User already exits")

    }

    const user = await User.create({
        username,
        email,
        password,
        profile
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            token: generateToken(user._id)

        })
    }
    else {
        res.status(400);
        throw new Error("Problem Creating User");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            profile: user.profile,
            token: generateToken(user._id)

        })
    }
    else {
        res.status(401);
        res.send("Invalid Password or User ID")
        throw new Error("Invalid Password or User ID")
    }
})

const allUser = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { username: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ],
        }
        : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
})

module.exports = { registerUser, authUser, allUser }