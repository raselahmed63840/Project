const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');


// POST /api/auth/register
async function register(req, res) {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { name, email, password, phoneNumber } = req.body;
const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ message: 'User already exists' });


const user = await User.create({ name, email, password, phoneNumber });
generateToken(res, user._id);
res.status(201).json({
_id: user._id,
name: user.name,
email: user.email,
phoneNumber: user.phoneNumber,
});
}


// POST /api/auth/login
async function login(req, res) {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const match = await user.matchPassword(password);
if (!match) return res.status(401).json({ message: 'Invalid credentials' });


generateToken(res, user._id);
res.json({
_id: user._id,
name: user.name,
email: user.email,
phoneNumber: user.phoneNumber,
});
}


// POST /api/auth/logout
function logout(req, res) {
res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
res.json({ message: 'Logged out' });
}


// GET /api/auth/me
async function getMe(req, res) {
res.json(req.user);
}


// PATCH /api/auth/me
async function updateMe(req, res) {
const { name, phoneNumber } = req.body;
if (name !== undefined) req.user.name = name;
if (phoneNumber !== undefined) req.user.phoneNumber = phoneNumber;
const updated = await req.user.save();
res.json({ _id: updated._id, name: updated.name, email: updated.email, phoneNumber: updated.phoneNumber });
}


module.exports = { register, login, logout, getMe, updateMe };