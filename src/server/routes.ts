import express from 'express';
import * as controller from './controllers';

const routes = express.Router();

routes.get('/students', controller.getStudents);
routes.get('/students/:id', controller.findStudent);
routes.post('/students', controller.validateNewStudent, controller.addStudent);
routes.patch(
  '/students/:id',
  controller.validateStudentUpdate,
  controller.updateStudent
);
routes.delete('/students/:id', controller.deleteStudent);

export default routes;
