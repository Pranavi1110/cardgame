// server/models/Stats.js
import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  wins: {
    type: Number,
    required: true,
    default: 0
  },
  losses: {
    type: Number,
    required: true,
    default: 0
  }
});

const Stats = mongoose.model('Stats', statsSchema);

export default Stats;
