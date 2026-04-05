import { Router } from 'express';
import multer, { MulterError } from 'multer';
import { generateUploadUrl, uploadOptimizedImage } from '../controllers/upload.controller';
import { verifyAdmin } from '../middleware/verifyAdmin';

const router = Router();

const optimizedUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 42 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files can be uploaded'));
      return;
    }
    cb(null, true);
  },
});

router.post('/generate-url', verifyAdmin, generateUploadUrl);

router.post(
  '/optimized',
  verifyAdmin,
  (req, res, next) => {
    optimizedUpload.single('file')(req, res, (err: unknown) => {
      if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(413).json({ success: false, error: 'File too large' });
          return;
        }
        res.status(400).json({ success: false, error: err.message });
        return;
      }
      if (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        res.status(400).json({ success: false, error: message });
        return;
      }
      next();
    });
  },
  uploadOptimizedImage
);

export default router;
