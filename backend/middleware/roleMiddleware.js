const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {

    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({
        message: `Forbidden: ${requiredRole} access required`,
      });
    }
    next();
  };
};

export default roleMiddleware;
