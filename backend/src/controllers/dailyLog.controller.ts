import { Request, Response, NextFunction } from 'express';
import LogEntry from '../models/LogEntry';

export async function getPublishedLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const query: any = { published: true };
    if (req.query.tag) {
      query.tags = req.query.tag as string;
    }
    if (req.query.search) {
      const s = new RegExp(req.query.search as string, 'i');
      query.$or = [{ title: s }, { body: s }, { tags: s }];
    }
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = parseInt(req.query.skip as string) || 0;
    const entries = await LogEntry.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
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
    const query: any = {};
    if (req.query.search) {
      const s = new RegExp(req.query.search as string, 'i');
      query.$or = [{ title: s }, { body: s }, { tags: s }];
    }
    if (req.query.published === 'true') query.published = true;
    if (req.query.published === 'false') query.published = false;
    const limit = parseInt(req.query.limit as string) || 500;
    const skip = parseInt(req.query.skip as string) || 0;
    const entries = await LogEntry.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, data: entries, count: entries.length });
  } catch (err) {
    next(err);
  }
}

export async function createLog(req: Request, res: Response, next: NextFunction) {
  try {
    const { date, title, body, tags, published, images } = req.body;
    if (!title || !body) {
      res.status(400).json({ success: false, error: 'Title and body are required' });
      return;
    }
    const entry = await LogEntry.create({ date, title, body, tags, published, images });
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
