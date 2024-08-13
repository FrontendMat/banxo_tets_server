module.exports = class ApiError extends Error {
    status;
    errors;
    constructor(status, message, errors) {
        super(message)
        this.status = status;
        this.errors = errors;
    }

    static UnAuthorizedError (errors = []) {
        return new ApiError( 401, 'Unauthorized', errors)
    }

    static BadRequest (message, errors = []) {
        return new ApiError(400, message, errors )
    }

    static InternalServerError (message, errors = []) {
        return new ApiError(500, 'Internal Server Error', errors )
    }
}