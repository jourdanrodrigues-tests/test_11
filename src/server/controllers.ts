import { Student } from '../models/student';
import { Request, Response } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { Book } from '../models/book';
import { ModelStatic } from 'sequelize';

type TController = {
  validateCreate: ValidationChain[];
  validateUpdate: ValidationChain[];
  list(req: Request, res: Response): void;
  get(req: Request, res: Response): void;
  create(req: Request, res: Response): void;
  update(req: Request, res: Response): void;
  deleteOne(req: Request, res: Response): void;
};

export const studentController: TController = {
  validateCreate: [
    body('name').isLength({ min: 1, max: 32 }),
    body('lastName').isLength({ min: 1, max: 32 }),
    body('email').isEmail().normalizeEmail().isLength({ min: 1 }),
    body('birthDate').optional({ nullable: true }).isISO8601()
  ],
  validateUpdate: [
    body('name').optional().isLength({ min: 1, max: 32 }),
    body('lastName').optional().isLength({ min: 1, max: 32 }),
    body('birthDate').optional({ nullable: true }).isISO8601()
  ],
  ...buildController(Student)
};

export const bookController: TController = {
  validateCreate: [
    body('name').isLength({ min: 1 }),
    body('pages').isNumeric(),
    body('description').isLength({ min: 1 }),
    body('publishedAt').isISO8601()
  ],
  validateUpdate: [
    body('name').optional().isLength({ min: 1 }),
    body('pages').optional().isNumeric(),
    body('description').optional().isLength({ min: 1 }),
    body('publishedAt').optional().isISO8601()
  ],
  ...buildController(Book)
};

function buildController(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: ModelStatic<any>
): Omit<TController, 'validateCreate' | 'validateUpdate'> {
  return { list, get, create, update, deleteOne };

  function list(req: Request, res: Response): void {
    model.findAll().then((items) => res.json(items));
  }

  async function get(req: Request, res: Response): Promise<void> {
    const item = await model.findByPk(req.params.id);
    if (item === null) {
      res.sendStatus(404);
    } else {
      res.json(item);
    }
  }

  function create(req: Request, res: Response): void {
    if (hasErrors(req, res)) return;
    model.create(req.body).then((item) => res.json(item));
  }

  async function update(req: Request, res: Response): Promise<void> {
    // TODO: Handle "updatedAt" flag (if it exists)
    if (hasErrors(req, res)) return;
    if (Object.keys(req.body).length === 0) {
      // No changes to be made here
      await get(req, res);
      return;
    }
    const [affected, students] = await model.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });
    if (affected === 0) {
      res.sendStatus(404);
    } else {
      // Since there is an affected row, we can assume it's in this array
      res.json(students.find(({ id }) => id === req.params.id));
    }
  }

  async function deleteOne(req: Request, res: Response): Promise<void> {
    const affected = await model.destroy({ where: { id: req.params.id } });
    res.sendStatus(affected === 1 ? 204 : 404);
  }
}

function hasErrors(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ errors: errors.array() });
  return true;
}
