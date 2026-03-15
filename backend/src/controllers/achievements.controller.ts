import { Request, Response, NextFunction } from 'express';
import Achievement from '../models/Achievement';
import { generateUploadUrlProfile, deleteFileFromR2 } from '../utils/fileUpload';

const R2_PUBLIC_BASE = process.env.R2_PUBLIC_BASE_URL || '';

function isR2Url(url: string): boolean {
  return !!R2_PUBLIC_BASE && url.startsWith(R2_PUBLIC_BASE);
}

export async function getAchievements(req: Request, res: Response, next: NextFunction) {
  try {
    const query: any = {};
    if (req.query.search) {
      const s = new RegExp(req.query.search as string, 'i');
      query.$or = [{ title: s }, { description: s }, { year: s }];
    }
    if (req.query.year) query.year = req.query.year as string;
    const items = await Achievement.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items, count: items.length });
  } catch (err) {
    next(err);
  }
}

export async function createAchievement(req: Request, res: Response, next: NextFunction) {
  try {
    const { icon, title, description, year, order, images } = req.body;
    if (!title || !description || !year) {
      res.status(400).json({ success: false, error: 'Title, description, and year are required' });
      return;
    }
    const item = await Achievement.create({ icon, title, description, year, order, images });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateAchievement(req: Request, res: Response, next: NextFunction) {
  try {
    const existing = await Achievement.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Achievement not found' });
      return;
    }

    // If icon URL changes and old icon was an R2 URL, delete old file
    if (req.body.icon && existing.icon !== req.body.icon && isR2Url(existing.icon)) {
      try {
        await deleteFileFromR2(existing.icon);
      } catch (err) {
        console.warn('Failed to delete old icon from R2:', err);
      }
    }

    const item = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteAchievement(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Achievement not found' });
      return;
    }

    // If achievement has R2 icon URL, delete the file
    if (isR2Url(item.icon)) {
      try {
        await deleteFileFromR2(item.icon);
      } catch (err) {
        console.warn('Failed to delete icon from R2:', err);
      }
    }

    // Delete all associated images from R2
    if (item.images && item.images.length > 0) {
      for (const imageUrl of item.images) {
        if (isR2Url(imageUrl)) {
          try {
            await deleteFileFromR2(imageUrl);
          } catch (err) {
            console.warn('Failed to delete image from R2:', err);
          }
        }
      }
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

export async function getUploadUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { fileName, fileType } = req.query;
    if (!fileName || !fileType) {
      res.status(400).json({ success: false, error: 'fileName and fileType are required' });
      return;
    }
    const result = await generateUploadUrlProfile(
      fileType as string,
      fileName as string,
      'achievements',
      req.admin!.id
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
