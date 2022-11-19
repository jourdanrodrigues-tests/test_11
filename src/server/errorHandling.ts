import { Response } from 'express';

type TSequelizeValidationError = Error & {
  name: 'SequelizeValidationError';
  // There are more metadata to type, but not important at the moment.
  errors: { message: string; path: string }[];
};

type TSequelizeDatabaseError = Error & {
  name: 'SequelizeDatabaseError';
  // There are more metadata to type, but not important at the moment.
  original: { routine: 'string_to_uuid' };
};

export function SequelizeErrorHandler(res: Response): (error: Error) => void {
  return (error) => {
    if (!isValidationError(error)) throw error;
    const fieldErrors = error.errors.reduce((output, { path, message }) => {
      const messages = output[path] || [];
      return { ...output, [path]: messages.concat(message) };
    }, {} as { [key: string]: string[] });
    res.json(fieldErrors);
  };
}

export function DatabaseErrorHandler(res: Response): (error: Error) => void {
  return (error) => {
    const isUUIDError =
      isDatabaseError(error) && error.original.routine === 'string_to_uuid';
    if (!isUUIDError) throw error;
    res.sendStatus(404);
  };
}

function isValidationError(error: Error): error is TSequelizeValidationError {
  return error.name === 'SequelizeValidationError';
}

function isDatabaseError(error: Error): error is TSequelizeDatabaseError {
  return error.name === 'SequelizeDatabaseError';
}
