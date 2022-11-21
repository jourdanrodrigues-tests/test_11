/* eslint-disable @typescript-eslint/no-explicit-any */
import { Student } from '../models/student';
import { BookReader } from '../models/bookReader';
import { Book } from '../models/book';
import Joi from 'joi';

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

const newStudentValidator = Joi.object({
  name: Joi.string().required().min(1).max(32),
  lastName: Joi.string().required().min(1).max(32),
  email: Joi.string().email().required(),
  birthDate: Joi.date().iso().optional().allow(null)
});

const updateStudentValidator = Joi.object({
  name: Joi.string().required().min(1).max(32),
  lastName: Joi.string().required().min(1).max(32),
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
      const { value: data, error } = newStudentValidator.validate(payload);
      if (error) return error;
      // TODO: Implement email confirmation
      const { email } = data;
      const student = await Student.findOne({ where: { email } });
      if (student === null) return Student.create(payload);
      throw new Error('This email is already in use by another student.');
    },
    updateStudent: async (_: any, payload: any) => {
      const { value, error } = updateStudentValidator.validate(payload);
      const { id: studentId, ...data } = value;
      if (error) return error;
      // No changes to be made if not data was sent
      if (Object.keys(data).length === 0) return Student.findByPk(studentId);
      const [affected, students] = await Student.update(data, {
        where: { id: studentId },
        returning: true
      });
      if (affected === 0) return new Error('Student not found.');
      // Since there is an affected row, we can assume it's in this array
      return students.find(({ id }) => id === studentId);
    },
    createBook: (_: any, payload: any) => {
      const { value: data, error } = bookValidator.validate(payload);
      return error || Book.create(data);
    },
    updateBook: async (_: any, payload: any) => {
      const { value, error } = bookValidator.validate(payload);
      const { id: bookId, ...data } = value;
      if (error) return error;
      // No changes to be made if not data was sent
      if (Object.keys(data).length === 0) return Book.findByPk(bookId);
      const [affected, books] = await Book.update(data, {
        where: { id: bookId },
        returning: true
      });
      if (affected === 0) return new Error('Book not found.');
      // Since there is an affected row, we can assume it's in this array
      return books.find(({ id }) => id === bookId);
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
  BookReader: {
    student: (reader: any) => Student.findByPk(reader.studentId),
    book: (reader: any) => Book.findByPk(reader.bookId)
  }
};

export default resolvers;
