import express from 'express';
import { createCitizenReport, getAllReports } from '../controllers/reportController.js';
import { citizenReportRules, validate } from '../middleware/validators.js';

const router = express.Router();

router.post('/citizen', citizenReportRules, validate, createCitizenReport);
router.get('/', getAllReports);

export default router;