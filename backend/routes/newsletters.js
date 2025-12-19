const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// Get all newsletter subscriptions
router.get('/', async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res.status(201).json(newsletter);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Unsubscribe from newsletter
router.delete('/:id', async (req, res) => {
  try {
    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
