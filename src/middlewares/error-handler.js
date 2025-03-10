class MyCustomError extends Error {
  constructor(message) {
    super(message);
    this.name = "MyCustomError";
  }
}

const errorHandler = (err, req, res, next) => {
  console.log(err);

  if (err.name === "SequelizeValidationError") {
    const validationErrors = err.errors.map(
      (validationError) => validationError.message
    );
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: validationErrors,
    });
  }

  if (err instanceof MyCustomError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: "Internal Server Error" });
};

export default errorHandler;
