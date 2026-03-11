import { Request, Response, NextFunction } from 'express';
import Thought from '../models/Thought';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function getPublishedThoughts(req: Request, res: Response, next: NextFunction) {
  try {
    const thoughts = await Thought.find({ published: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: thoughts, count: thoughts.length });
  } catch (err) {
    next(err);
  }
}

export async function getAllThoughts(req: Request, res: Response, next: NextFunction) {
  try {
    const thoughts = await Thought.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: thoughts, count: thoughts.length });
  } catch (err) {
    next(err);
  }
}

export async function createThought(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, title, summary, published, order } = req.body;
    if (!topic || !title || !summary) {
      res.status(400).json({ success: false, error: 'Topic, title, and summary are required' });
      return;
    }
    const slug = generateSlug(title);
    const thought = await Thought.create({ topic, title, summary, slug, published, order });
    res.status(201).json({ success: true, data: thought });
  } catch (err) {
    next(err);
  }
}

export async function updateThought(req: Request, res: Response, next: NextFunction) {
  try {
    // Regenerate slug if title changed
    if (req.body.title) {
      req.body.slug = generateSlug(req.body.title);
    }
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!thought) {
      res.status(404).json({ success: false, error: 'Thought not found' });
      return;
    }
    res.json({ success: true, data: thought });
  } catch (err) {
    next(err);
  }
}

export async function togglePublishThought(req: Request, res: Response, next: NextFunction) {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      res.status(404).json({ success: false, error: 'Thought not found' });
      return;
    }
    thought.published = !thought.published;
    await thought.save();
    res.json({ success: true, data: thought });
  } catch (err) {
    next(err);
  }
}

export async function deleteThought(req: Request, res: Response, next: NextFunction) {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      res.status(404).json({ success: false, error: 'Thought not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
