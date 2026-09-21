import { Router } from 'express';
import { getPublicEvents, getPublicBoard } from '../controllers/public';

const router = Router();

router.get('/events', getPublicEvents);
router.get('/board', getPublicBoard);

export default router;
