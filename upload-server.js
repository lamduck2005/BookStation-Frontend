import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Base URL cho images - thay đổi theo domain của bạn
const BASE_URL = 'http://localhost:3001'; // Có thể thay bằng domain thực tế

// Enable CORS
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'src/assets/uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'src/assets/uploads/events');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create year/month folder structure
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const yearMonthDir = path.join(uploadsDir, year.toString(), month);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(yearMonthDir)) {
      fs.mkdirSync(yearMonthDir, { recursive: true });
    }
    
    cb(null, yearMonthDir);
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
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
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

// Single image upload
app.post('/api/upload/event-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create full URL with date folder structure
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const fileUrl = `${BASE_URL}/uploads/events/${year}/${month}/${req.file.filename}`;
    console.log('Single image uploaded:', fileUrl);

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

// Multiple images upload
app.post('/api/upload/event-images', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Create full URLs with date folder structure
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const urls = req.files.map(file => `${BASE_URL}/uploads/events/${year}/${month}/${file.filename}`);
    console.log('Multiple images uploaded:', urls);

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

// Delete image
app.delete('/api/upload/event-image', express.json(), (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Extract filename from URL
    const fileName = path.basename(imageUrl);
    const filePath = path.join(uploadsDir, fileName);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Image deleted:', filePath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/upload/health', (req, res) => {
  res.json({ status: 'Upload server is running', port: PORT });
});

app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});
