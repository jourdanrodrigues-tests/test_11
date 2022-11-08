import Student from '../models/student';
import { Request, Response } from 'express';

export function getStudents(req: Request, res: Response): void {
  Student.findAll().then(res.json);
}

export function findStudent(req: Request, res: Response): void {
  Student.findByPk(req.params.id).then(res.json);
}

export function addStudent(req: Request, res: Response): void {
  Student.create(req.body).then(res.json);
}

export function updateStudent(req: Request, res: Response): void {
  Student.update(req.body, { where: { id: req.params.id } })
    .then(() => Student.findByPk(req.params.id))
    .then(res.json);
}

export function deleteStudent(req: Request, res: Response): void {
  Student.destroy({ where: { id: req.params.id } })
    .then(() => Student.findAll())
    .then(res.json);
}
