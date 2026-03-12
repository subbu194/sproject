import { Request, Response, NextFunction } from 'express';
import { generateUploadUrlProfile } from '../utils/fileUpload';

export async function generateUploadUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileName, fileType, folder } = req.body;
    
    if (!fileName || !fileType || !folder) {
      res.status(400).json({ success: false, error: 'fileName, fileType, and folder are required' });
      return;
    }

    // Admin token should be present from verifyAdmin, but we also can pass role statically
    const result = await generateUploadUrlProfile(fileType, fileName, folder, 'admin', false);
    
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
