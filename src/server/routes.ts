import express from 'express';
import * as controller from './controllers';

const routes = express.Router();

routes.get('/students', controller.getStudents);
routes.get('/students/:id', controller.findStudent);
routes.post('/students', controller.addStudent);
routes.patch('/students/:id', controller.updateStudent);
routes.delete('/students/:id', controller.deleteStudent);

export default routes;
