import { body, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

// Runs after the validation chain, collects errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => `${e.path}: ${e.msg}`).join(', ');
    return next(new AppError(messages, 400));
  }
  next();
};

export const citizenReportRules = [
  body('text')
    .trim()
    .notEmpty().withMessage('Report text is required')
    .isLength({ min: 5, max: 1000 }).withMessage('Text must be between 5 and 1000 characters'),

  body('lat')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('lat must be a valid latitude'),

  body('lng')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('lng must be a valid longitude'),

  body('media')
    .optional()
    .isArray().withMessage('media must be an array'),

  body('media.*.url')
    .optional()
    .isURL().withMessage('Each media item needs a valid url'),

  body('media.*.type')
    .optional()
    .isIn(['image', 'video']).withMessage('media type must be image or video')
];