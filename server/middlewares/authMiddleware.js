// Middleware (Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
  // Temporarily disabled for testing - allow all requests
  next();
};
