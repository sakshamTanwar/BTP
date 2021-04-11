export class AppError extends Error{
    statusCode: number;
    error: string;
    message: string;
    
    constructor(statusCode: number, error: string, message: string) {
      super();
      this.statusCode = statusCode;
      this.error = error;
      this.message = message;  
    }

}