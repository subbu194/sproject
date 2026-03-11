import { Request, Response, NextFunction } from 'express';
import LogEntry from '../models/LogEntry';

export async function getPublishedLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const query: any = { published: true };
    if (req.query.tag) {
      query.tags = req.query.tag as string;
    }
    const entries = await LogEntry.find(query).sort({ date: -1 });
    res.json({ success: true, data: entries, count: entries.length });
  } catch (err) {
    next(err);
  }
}

export async function getTags(req: Request, res: Response, next: NextFunction) {
  try {
    const tags = await LogEntry.distinct('tags', { published: true });
    res.json({ success: true, data: tags });
  } catch (err) {
    next(err);
  }
}

export async function getAllLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const entries = await LogEntry.find().sort({ date: -1 });
    res.json({ success: true, data: entries, count: entries.length });
  } catch (err) {
    next(err);
  }
}

export async function createLog(req: Request, res: Response, next: NextFunction) {
  try {
    const { date, title, body, tags, published } = req.body;
    if (!title || !body) {
      res.status(400).json({ success: false, error: 'Title and body are required' });
      return;
    }
    const entry = await LogEntry.create({ date, title, body, tags, published });
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
}

export async function updateLog(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await LogEntry.findByIdAndUpdate(req.params.id, req.body, {
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

export async function togglePublish(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await LogEntry.findById(req.params.id);
    if (!entry) {
      res.status(404).json({ success: false, error: 'Entry not found' });
      return;
    }
    entry.published = !entry.published;
    await entry.save();
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
}

export async function deleteLog(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await LogEntry.findByIdAndDelete(req.params.id);
    if (!entry) {
      res.status(404).json({ success: false, error: 'Entry not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
