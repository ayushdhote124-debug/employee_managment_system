export const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403);
      next(new Error(`Role (${req.user ? req.user.role : 'none'}) is not authorized to access this resource`));
    }
  };
};