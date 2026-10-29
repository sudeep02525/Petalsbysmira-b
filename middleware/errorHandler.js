export const errorHandler = (err, req, res, next) => {
  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  // Mongoose Validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message: messages || "Validation error" });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({ message: `A record with this ${field} already exists.` });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && status === 500
      ? "Internal server error"
      : err.message || "Server error";

  if (process.env.NODE_ENV !== "production") {
    console.error("Server Error:", err);
  } else if (status === 500) {
    console.error("Server Error [500]:", err.message);
  }

  res.status(status).json({ message });
};

