import express from 'express';
import {
  studentController,
  bookController,
  bookReaderController
} from './controllers';

const routes = express.Router();

routes.get('/students', studentController.list);
routes.get('/students/:id', studentController.get);
routes.post(
  '/students',
  studentController.validateCreate,
  studentController.create
);
routes.patch(
  '/students/:id',
  studentController.validateUpdate,
  studentController.update
);
routes.delete('/students/:id', studentController.delete);

routes.get('/books', bookController.list);
routes.get('/books/:id', bookController.get);
routes.post('/books', bookController.validateCreate, bookController.create);
routes.patch(
  '/books/:id',
  bookController.validateUpdate,
  bookController.update
);
routes.delete('/books/:id', bookController.delete);

routes.get('/bookReaders', bookReaderController.list);
routes.post(
  '/bookReaders',
  bookReaderController.validateCreate,
  bookReaderController.create
);
routes.delete('/bookReaders/:id', bookReaderController.delete);

export default routes;
