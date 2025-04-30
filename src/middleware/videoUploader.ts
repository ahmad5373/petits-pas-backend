import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log('req :>> ', req);
      console.log('file :>> ', file);
      const uploadDir = path.join(__dirname, 'uploads');
      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      console.log('file in storage:>> ', file);
      // Create unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });


// File filter to only accept video files
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  console.log('file :>> ', file);
    // Accept video files only
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  };


const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB limit (adjust as needed)
    }
  });

export { upload };
