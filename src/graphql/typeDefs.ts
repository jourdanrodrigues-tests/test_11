import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Student {
    id: String
    name: String
    lastName: String
    email: String
    birthDate: String
    books: [Book!]!
  }
  type Book {
    id: String
    name: String
    pages: Int
    publishedAt: String
    description: String
    students: [Student!]!
  }
  type BookReader {
    id: String
    student: Student!
    book: Book!
  }
  type Query {
    student(id: String!): Student!
    students: [Student!]!
    book(id: String!): Book!
    books: [Book!]!
    bookReader(id: String!): BookReader!
    bookReaders: [BookReader!]!
  }
  type Mutation {
    createStudent(
      name: String
      lastName: String
      email: String
      birthDate: String
    ): Student!
    deleteStudent(id: String): Boolean
    createBook(
      name: String
      description: String
      pages: Int
      publishedAt: String
    ): Book!
    deleteBook(id: String): Boolean
    createBookReader(studentId: String, bookId: String): BookReader!
  }
`;

export default typeDefs;
