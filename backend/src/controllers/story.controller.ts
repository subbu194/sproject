import { Request, Response, NextFunction } from 'express';
import TimelineEntry from '../models/TimelineEntry';

export async function getTimeline(req: Request, res: Response, next: NextFunction) {
  try {
    const query: Record<string, any> = {};
    if (req.query.search) {
      const s = new RegExp(req.query.search as string, 'i');
      query.$or = [{ year: s }, { title: s }, { description: s }];
    }
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = parseInt(req.query.skip as string) || 0;
    const entries = await TimelineEntry.find(query)
      .sort({ order: 1, createdAt: 1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, data: entries, count: entries.length });
  } catch (err) {
    next(err);
  }
}

export async function createTimelineEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const { year, title, description, order } = req.body;
    if (!year || !title || !description) {
      res.status(400).json({ success: false, error: 'Year, title, and description are required' });
      return;
    }
    const entry = await TimelineEntry.create({ year, title, description, order });
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
}

export async function updateTimelineEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await TimelineEntry.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!entry) {
      res.status(404).json({ success: false, error: 'Entry not found' });
      return;
    }
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
}

export async function deleteTimelineEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await TimelineEntry.findByIdAndDelete(req.params.id);
    if (!entry) {
      res.status(404).json({ success: false, error: 'Entry not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
