import Student from './student';
import Book from './book';
import BookReader from './bookReader';

const db = { Student, Book, BookReader } as const;

Object.keys(db).forEach((modelName) => {
  // @ts-ignore
  const method = db[modelName].associate;
  if (!method) return;
  method(db);
});

export default db;
