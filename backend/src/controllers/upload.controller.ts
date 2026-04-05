import { Request, Response, NextFunction } from 'express';
import { generateUploadUrlProfile } from '../utils/fileUpload';
import { processUploadAndStoreInR2 } from '../utils/imageService';

export async function generateUploadUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileName, fileType, folder } = req.body;

    if (!fileName || !fileType || !folder) {
      res.status(400).json({ success: false, error: 'fileName, fileType, and folder are required' });
      return;
    }

    const result = await generateUploadUrlProfile(fileType, fileName, folder, 'admin', false);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function uploadOptimizedImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file?.buffer?.length) {
      res.status(400).json({ success: false, error: 'Image file is required (form field name: file)' });
      return;
    }

    const { publicUrl, blurUrl } = await processUploadAndStoreInR2(req.file.buffer);

    res.status(200).json({
      success: true,
      data: { publicUrl, blurUrl },
    });
  } catch (err) {
    next(err);
  }
}
