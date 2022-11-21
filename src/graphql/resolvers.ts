/* eslint-disable @typescript-eslint/no-explicit-any */
import { Student } from '../models/student';
import { BookReader } from '../models/bookReader';
import { Book } from '../models/book';
import Joi from 'joi';
import { Op } from 'sequelize';

const newReaderValidator = Joi.object({
  studentId: Joi.string().uuid().required(),
  bookId: Joi.string().uuid().required()
});

const bookValidator = Joi.object({
  name: Joi.string().required().min(1),
  pages: Joi.number().required(),
  description: Joi.string().required().min(1),
  publishedAt: Joi.date().iso().required()
});

const studentValidator = Joi.object({
  name: Joi.string().required().min(1).max(32),
  lastName: Joi.string().required().min(1).max(32),
  email: Joi.string().email().required(),
  birthDate: Joi.date().iso().optional().allow(null)
});

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
    createStudent: async (_: any, payload: any) => {
      const { value: data, error } = studentValidator.validate(payload);
      if (error) return error;
      // TODO: Implement email confirmation
      const { email } = data;
      const student = await Student.findOne({ where: { email } });
      if (student === null) return Student.create(payload);
      throw new Error('This email is already in use by another student.');
    },
    createBook: (_: any, payload: any) => {
      const { value: data, error } = bookValidator.validate(payload);
      return error || Book.create(data);
    },
    createBookReader: async (_: any, payload: any) => {
      const result = newReaderValidator.validate(payload);
      if (result.error) return result.error;
      const { bookId, studentId } = result.value;
      const [student, book] = await Promise.all([
        Book.findByPk(bookId),
        Student.findByPk(studentId)
      ]);
      if (student === null) return new Error('Student not found.');
      if (book === null) return new Error('Book not found.');
      const readers = await BookReader.findAll({ where: { bookId } });
      if (readers.length >= 3) {
        return new Error('Book is being read by 3 people or more already.');
      }
      const alreadyReading = readers.find(
        (reader) => reader.studentId === studentId
      );
      if (alreadyReading) return BookReader.create(result.value);
      return new Error('This student is already reading this book.');
    }
  },
  Student: {
    books: async ({ id }: any) => {
      // TODO: "Associate" models to do this in one query
      const readers = await BookReader.findAll({ where: { studentId: id } });
      const bookIds = readers.map((reader) => reader.bookId);
      // @ts-ignore
      return Book.findAll({ where: { id: { [Op.in]: bookIds } } });
    }
  },
  Book: {
    students: async ({ id }: any) => {
      // TODO: "Associate" models to do this in one query
      const readers = await BookReader.findAll({ where: { bookId: id } });
      const studentIds = readers.map((reader) => reader.studentId);
      // @ts-ignore
      return Student.findAll({ where: { id: { [Op.in]: studentIds } } });
    }
  },
  BookReader: {
    student: (reader: any) => Student.findByPk(reader.studentId),
    book: (reader: any) => Book.findByPk(reader.bookId)
  }
};

export default resolvers;
