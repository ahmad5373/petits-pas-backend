import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads'); // Save files in 'uploads' folder
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// File filter for videos
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file format'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100 // 100MB limit
    },
    fileFilter: fileFilter
});

export { upload };
