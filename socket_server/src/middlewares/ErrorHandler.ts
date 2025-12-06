import {AppError} from "../errors/AppError";

function handleError(err: AppError) {
    console.log("ERROR LOG FROM HANDLER ", err); // Log for debugging

    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.log(status, message);
}

export default handleError;