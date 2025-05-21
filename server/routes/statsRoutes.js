import express from 'express';
import { getStats, updateStats, resetStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getStats);
router.post('/', updateStats);
router.post('/reset', resetStats);

export default router;
