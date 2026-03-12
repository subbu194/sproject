import { Request, Response, NextFunction } from 'express';
import PressItem from '../models/PressItem';

export async function getPress(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = parseInt(req.query.skip as string) || 0;
    const items = await PressItem.find()
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, data: items, count: items.length });
  } catch (err) {
    next(err);
  }
}

export async function createPress(req: Request, res: Response, next: NextFunction) {
  try {
    const { outlet, title, year, url, order, images } = req.body;
    if (!outlet || !title || !year) {
      res.status(400).json({ success: false, error: 'Outlet, title, and year are required' });
      return;
    }
    const item = await PressItem.create({ outlet, title, year, url, order, images });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updatePress(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await PressItem.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!item) {
      res.status(404).json({ success: false, error: 'Press item not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deletePress(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await PressItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Press item not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
