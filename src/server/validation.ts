import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export function hasErrors(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ errors: errors.array() });
  return true;
}
