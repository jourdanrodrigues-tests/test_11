import { Student } from '../models/student';
import { Request, Response } from 'express';
import { SequelizeErrorHandler, DatabaseErrorHandler } from './errorHandling';

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
  Student.create(req.body)
    .then((student) => res.json(student))
    .catch(SequelizeErrorHandler(res));
}

export function updateStudent(req: Request, res: Response): void {
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
        const student = students.find(({ id }) => id === studentId);
        res.json(student);
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
