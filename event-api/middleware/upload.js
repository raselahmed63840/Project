const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);


const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, uploadDir);
},
filename: function (req, file, cb) {
const ext = path.extname(file.originalname);
const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
cb(null, name);
},
});


function fileFilter(req, file, cb) {
const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
const ext = path.extname(file.originalname).toLowerCase();
if (!allowed.includes(ext)) return cb(new Error('Only image files are allowed'));
cb(null, true);
}


const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });


module.exports = upload;