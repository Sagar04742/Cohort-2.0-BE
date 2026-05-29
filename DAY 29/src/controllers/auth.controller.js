export async function register(req, res, next) {
  try {
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
}
