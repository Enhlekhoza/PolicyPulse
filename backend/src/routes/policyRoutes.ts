import { Router } from 'express';
import { getPolicies, runSimulation, getSimulationHistory } from '../controllers/policyController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/policies', getPolicies);
router.post('/simulate', protect, runSimulation);
router.get('/history', protect, getSimulationHistory);

export default router;
