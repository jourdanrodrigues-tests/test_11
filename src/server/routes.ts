import express from 'express';
import { studentController } from './controllers';

const routes = express.Router();

routes.get('/students', studentController.getStudents);
routes.get('/students/:id', studentController.findStudent);
routes.post(
  '/students',
  studentController.validateNewStudent,
  studentController.addStudent
);
routes.patch(
  '/students/:id',
  studentController.validateStudentUpdate,
  studentController.updateStudent
);
routes.delete('/students/:id', studentController.deleteStudent);

export default routes;
