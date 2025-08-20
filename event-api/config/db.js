const mongoose = require('mongoose');


module.exports = async function connectDB() {
try {
const conn = await mongoose.connect(process.env.MONGO_URI);
console.log(`MongoDB Connected: ${conn.connection.host}`);
} catch (err) {
console.error('MongoDB connection error:', err.message);
process.exit(1);
}
};