import { Student } from '../models/student';
import { Request, Response } from 'express';
import { SequelizeErrorHandler, DatabaseErrorHandler } from './errorHandling';
import { body } from 'express-validator';
import { hasErrors } from './validation';

export const validateNewStudent = [
  body('name').isLength({ min: 1, max: 32 }),
  body('lastName').isLength({ min: 1, max: 32 }),
  body('email').isEmail().normalizeEmail().isLength({ min: 1 }),
  body('birthDate').optional({ nullable: true }).isISO8601()
];

export const validateStudentUpdate = [
  body('name').optional().isLength({ min: 1, max: 32 }),
  body('lastName').optional().isLength({ min: 1, max: 32 }),
  body('birthDate').optional({ nullable: true }).isISO8601()
];

export function getStudents(req: Request, res: Response): void {
  Student.findAll().then((students) => res.json(students));
}

export function findStudent(req: Request, res: Response): void {
  Student.findByPk(req.params.id)
    .then((student) => {
      if (student === null) {
        res.sendStatus(404);
      } else {
        res.json(student);
      }
    })
    .catch(DatabaseErrorHandler(res));
}

export function addStudent(req: Request, res: Response): void {
  if (hasErrors(req, res)) return;
  Student.create(req.body)
    .then((student) => res.json(student))
    .catch(SequelizeErrorHandler(res));
}

export function updateStudent(req: Request, res: Response): void {
  if (hasErrors(req, res)) return;
  if (Object.keys(req.body).length === 0) {
    // No change to be made here
    findStudent(req, res);
    return;
  }
  const studentId = req.params.id;
  Student.update(req.body, {
    where: { id: studentId },
    returning: true
  })
    .then(([affected, students]) => {
      if (affected === 0) {
        res.sendStatus(404);
      } else {
        // Since there is an affected row, we can assume it's in this array
        res.json(students.find(({ id }) => id === studentId));
      }
    })
    .catch(DatabaseErrorHandler(res));
}

export function deleteStudent(req: Request, res: Response): void {
  Student.destroy({ where: { id: req.params.id } })
    .then((affected) => {
      res.sendStatus(affected === 1 ? 204 : 404);
    })
    .catch(DatabaseErrorHandler(res));
}
