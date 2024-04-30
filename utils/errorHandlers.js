// class BadUserRequestError extends Error {
//     constructor(message){
//       super(message)
//       this.status = 400;
//       this.errorType = "BadUserRequestError";
//     }
// }

// class NotFoundError extends Error {
//   constructor(message){
//     super(message)
//     this.status = 404;
//     this.errorType = "NotFoundError";
//   }
// }

// class UnAuthorizedError extends Error {
//   constructor(message){
//     super(message)
//     this.status = 401;
//     this.errorType = "UnAuthorizedError";
//   }
// }

// class FailedRequestError extends Error {
//   constructor(message){
//     super(message)
//     this.status = 500;
//     this.errorType = "FailedRequestError";
//   }
// }



// function createError(status, errorType, message) {
//   const error = new Error(message);
//   error.status = status;
//   error.errorType = errorType;
//   return error;
// }

// function BadUserRequestError(message) {
//   return createError(400, "BadUserRequestError", message);
// }

// function NotFoundError(message) {
//   return createError(404, "NotFoundError", message);
// }

// function UnAuthorizedError(message) {
//   return createError(401, "UnAuthorizedError", message);
// }

// function FailedRequestError(message) {
//   return createError(500, "FailedRequestError", message);
// }


class BadUserRequestError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.errorType = "BadUserRequestError";
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
    this.errorType = "NotFoundError";
  }
}

class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
    this.errorType = "UnAuthorizedError";
  }
}

class FailedRequestError extends Error {
  constructor(message) {
    super(message);
    this.status = 500;
    this.errorType = "FailedRequestError";
  }
}

module.exports = {
  BadUserRequestError,
  NotFoundError,
  UnAuthorizedError,
  FailedRequestError
};
