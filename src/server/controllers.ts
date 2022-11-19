import { Student } from '../models/student';
import { Request, Response } from 'express';
import { SequelizeErrorHandler, DatabaseErrorHandler } from './errorHandling';
import { body, ValidationChain } from 'express-validator';
import { hasErrors } from './validation';
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
  model: ModelStatic<any>
): Omit<TController, 'validateCreate' | 'validateUpdate'> {
  return { list, get, create, update, deleteOne };

  function list(req: Request, res: Response): void {
    model.findAll().then((items) => res.json(items));
  }

  function get(req: Request, res: Response): void {
    model
      .findByPk(req.params.id)
      .then((item) => {
        if (item === null) {
          res.sendStatus(404);
        } else {
          res.json(item);
        }
      })
      .catch(DatabaseErrorHandler(res));
  }

  function create(req: Request, res: Response): void {
    if (hasErrors(req, res)) return;
    model
      .create(req.body)
      .then((item) => res.json(item))
      .catch(SequelizeErrorHandler(res));
  }

  function update(req: Request, res: Response): void {
    if (hasErrors(req, res)) return;
    if (Object.keys(req.body).length === 0) {
      // No change to be made here
      get(req, res);
      return;
    }
    const bookId = req.params.id;
    Book.update(req.body, {
      where: { id: bookId },
      returning: true
    })
      .then(([affected, students]) => {
        if (affected === 0) {
          res.sendStatus(404);
        } else {
          // Since there is an affected row, we can assume it's in this array
          res.json(students.find(({ id }) => id === bookId));
        }
      })
      .catch(DatabaseErrorHandler(res));
  }

  function deleteOne(req: Request, res: Response): void {
    Book.destroy({ where: { id: req.params.id } })
      .then((affected) => {
        res.sendStatus(affected === 1 ? 204 : 404);
      })
      .catch(DatabaseErrorHandler(res));
  }
}
