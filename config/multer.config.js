const multer = require('multer');
const cloudinary = require('./cloudinary.config'); // Import your Cloudinary config
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', 
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, 
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
