/* eslint-disable @typescript-eslint/no-explicit-any */
import { Student } from '../models/student';
import { BookReader } from '../models/bookReader';
import { Book } from '../models/book';
import { CreationAttributes } from 'sequelize/types/model';

const resolvers = {
  Query: {
    student: (_: any, { id }: { id: string }) => Student.findByPk(id),
    students: () => Student.findAll(),
    book: (_: any, { id }: { id: string }) => Book.findByPk(id),
    books: () => Book.findAll(),
    bookReader: (_: any, { id }: { id: string }) => BookReader.findByPk(id),
    bookReaders: () => BookReader.findAll()
  },
  Mutation: {
    createStudent: (_: any, data: CreationAttributes<Student>) =>
      Student.create(data),
    createBook: (_: any, data: CreationAttributes<Book>) => Book.create(data),
    createBookReader: (_: any, data: CreationAttributes<BookReader>) =>
      BookReader.create(data)
  },
  BookReader: {
    student: (reader: any) => Student.findByPk(reader.studentId),
    book: (reader: any) => Book.findByPk(reader.bookId)
  }
};

export default resolvers;
