// server/controllers/statsController.js
import Stats from '../models/Stats.js';

// Initialize stats in the database if not already present
const initializeStats = async () => {
  const count = await Stats.countDocuments();
  if (count === 0) {
    await Stats.create({ wins: 0, losses: 0 });
  }
};

export const getStats = async (req, res) => {
  try {
    await initializeStats();
    const stats = await Stats.findOne();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get stats', details: err.message });
  }
};

export const updateStats = async (req, res) => {
  const { result } = req.body;
  try {
    await initializeStats();
    const stats = await Stats.findOne();

    if (result === 'win') stats.wins += 1;
    else if (result === 'lose') stats.losses += 1;

    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stats', details: err.message });
  }
};

export const resetStats = async (req, res) => {
  try {
    await initializeStats();
    const stats = await Stats.findOne();

    stats.wins = 0;
    stats.losses = 0;

    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset stats', details: err.message });
  }
};
