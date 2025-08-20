const jwt = require('jsonwebtoken');
const User = require('../models/User');


async function protect(req, res, next) {
try {
const token = req.cookies?.jwt;
if (!token) return res.status(401).json({ message: 'Not authorized, no token' });


const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.userId).select('-password');
if (!req.user) return res.status(401).json({ message: 'User not found' });
next();
} catch (err) {
return res.status(401).json({ message: 'Not authorized, token failed' });
}
}


module.exports = { protect };