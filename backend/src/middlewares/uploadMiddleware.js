const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary credentials are configured
const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key';

let upload;

if (hasCloudinary) {
  // Use Cloudinary storage when credentials are available
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'lost-and-found',
      allowedFormats: ['jpg', 'png', 'jpeg'],
    },
  });

  upload = multer({ storage: storage });
} else {
  // Fallback to local disk storage when Cloudinary is not configured
  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mime = allowedTypes.test(file.mimetype);
      if (ext && mime) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (jpg, png, jpeg, webp) are allowed'));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
}

module.exports = upload;
