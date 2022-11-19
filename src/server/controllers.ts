import { Request, Response } from 'express';
import {
  body,
  matchedData,
  ValidationChain,
  validationResult
} from 'express-validator';
import { ModelStatic } from 'sequelize';

import { Student } from '../models/student';
import { Book } from '../models/book';
import { BookReader } from '../models/bookReader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Model = ModelStatic<any>;

type TControllerMethods = {
  list(req: Request, res: Response): void;
  get(req: Request, res: Response): void;
  create(req: Request, res: Response): void;
  update(req: Request, res: Response): void;
  delete(req: Request, res: Response): void;
};
type TController = TControllerMethods & {
  validateCreate: ValidationChain[];
  validateUpdate: ValidationChain[];
};

export const studentController: TController = {
  validateCreate: [
    body('name').isLength({ min: 1, max: 32 }),
    body('lastName').isLength({ min: 1, max: 32 }),
    body('email')
      .isEmail()
      .normalizeEmail()
      .custom(async (email) => {
        // TODO: Validate email
        const student = await Student.findOne({ where: { email } });
        return student === null;
      }),
    body('birthDate').optional({ nullable: true }).isISO8601()
  ],
  validateUpdate: [
    body('name').optional().isLength({ min: 1, max: 32 }),
    body('lastName').optional().isLength({ min: 1, max: 32 }),
    body('birthDate').optional({ nullable: true }).isISO8601()
    // TODO: Implement an email verification flow (the reason why it's missing)
  ],
  list: listMethod(Student),
  get: getMethod(Student),
  update: updateMethod(Student),
  create: createMethod(Student),
  delete: deleteMethod(Student)
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
  list: listMethod(Book),
  get: getMethod(Book),
  update: updateMethod(Book),
  create: createMethod(Book),
  delete: deleteMethod(Book)
};

export const bookReaderController: Omit<
  TController,
  'validateUpdate' | 'update' | 'get'
> = {
  validateCreate: [
    body('studentId')
      .isUUID()
      .custom(async (studentId) => {
        return (await Student.findByPk(studentId)) !== null;
      }),
    body('bookId')
      .isUUID()
      .custom(async (bookId) => {
        const readCount = await BookReader.count({ where: { bookId } });
        if (readCount < 3) return (await Book.findByPk(bookId)) !== null;
        throw new Error('Book is being read by 3 people or more already.');
      })
  ],
  list: listMethod(BookReader),
  create: createMethod(BookReader),
  delete: deleteMethod(BookReader)
};

function listMethod(model: Model): (req: Request, res: Response) => void {
  return (req, res) => {
    model.findAll().then((items) => res.json(items));
  };
}

function getMethod(
  model: Model
): (req: Request, res: Response) => Promise<void> {
  return async (req, res) => {
    const item = await model.findByPk(req.params.id);
    if (item === null) {
      res.sendStatus(404);
    } else {
      res.json(item);
    }
  };
}

function createMethod(model: Model): (req: Request, res: Response) => void {
  return (req, res) => {
    if (hasErrors(req, res)) return;
    const payload = matchedData(req, { locations: ['body'] });
    model.create(payload).then((item) => res.json(item));
  };
}

function updateMethod(
  model: Model
): (req: Request, res: Response) => Promise<void> {
  return async (req, res) => {
    // TODO: Handle "updatedAt" flag (if it exists)
    if (hasErrors(req, res)) return;
    const payload = matchedData(req, { locations: ['body'] });
    if (Object.keys(payload).length === 0) {
      // No changes to be made here
      await getMethod(model)(req, res);
      return;
    }
    const [affected, items] = await model.update(payload, {
      where: { id: req.params.id },
      returning: true
    });
    if (affected === 0) {
      res.sendStatus(404);
    } else {
      // Since there is an affected row, we can assume it's in this array
      res.json(items.find(({ id }) => id === req.params.id));
    }
  };
}

function deleteMethod(
  model: Model
): (req: Request, res: Response) => Promise<void> {
  return async (req, res) => {
    const affected = await model.destroy({ where: { id: req.params.id } });
    res.sendStatus(affected === 1 ? 204 : 404);
  };
}

function hasErrors(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ errors: errors.array() });
  return true;
}
