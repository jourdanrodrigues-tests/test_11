import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Student {
    id: String
    name: String
    lastName: String
    email: String
    birthDate: String
  }
  type Book {
    id: String
    name: String
    pages: Int
    publishedAt: String
    description: String
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
    updateStudent(
      id: String
      name: String
      lastName: String
      birthDate: String
    ): Student!
    createBook(
      name: String
      description: String
      pages: Int
      publishedAt: String
    ): Book!
    updateBook(
      id: String
      name: String
      description: String
      pages: Int
      publishedAt: String
    ): Book!
    createBookReader(studentId: String, bookId: String): BookReader!
  }
`;

export default typeDefs;
