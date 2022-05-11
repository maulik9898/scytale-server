import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

export const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response
      .status(status)
      .send({
        statusCode:status,
        status: 'fail',
        message,
      })
  }

export const errorLogger = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    console.error(`[ERROR] : ${error.status} : ${error.message}`);
    next(error)
  }
   
