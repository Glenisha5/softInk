import express, { Request, Response } from 'express';
import Feedback from '../models/Feedback.ts';

const router = express.Router();

// GET /api/feedback — fetch all feedback, newest first
router.get('/', async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).limit(100);
    res.json(feedback);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// POST /api/feedback — submit new feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, message, rating } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedback = new Feedback({
      name: name && name.trim() ? name.trim() : 'Anonymous',
      message: message.trim(),
      rating: numericRating,
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// PATCH /api/feedback/:id/like — increment like count by 1
router.patch('/:id/like', async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (err) {
    console.error('Error liking feedback:', err);
    res.status(500).json({ error: 'Failed to like feedback' });
  }
});

export default router;