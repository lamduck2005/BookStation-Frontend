import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tạo middleware upload cho Vite
export function createUploadMiddleware() {
  const router = express.Router();
  
  // Cấu hình multer
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      
      const uploadsDir = path.join(process.cwd(), 'src/assets/uploads/events', year.toString(), month);
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(file.originalname);
      const fileName = `image${timestamp}_${randomId}${extension}`;
      cb(null, fileName);
    }
  });

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });

  // Multiple images upload
  router.post('/event-images', upload.array('images', 5), (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      
      // Tạo URLs tương đối - Vite sẽ tự động serve từ src/assets/
      const urls = req.files.map(file => 
        `/src/assets/uploads/events/${year}/${month}/${file.filename}`
      );

      res.json({
        success: true,
        urls: urls,
        message: 'Upload successful'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Single image upload
  router.post('/event-image', upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      
      const fileUrl = `/src/assets/uploads/events/${year}/${month}/${req.file.filename}`;

      res.json({
        success: true,
        url: fileUrl,
        message: 'Upload successful'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
