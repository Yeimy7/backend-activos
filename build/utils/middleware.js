import * as logger from './logger.js';
export const requestLogger = (request, _response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};
export const unknownEndpoint = (_request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  });
};
export const errorHandler = (error, _request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    });
  }

  next(error);
};