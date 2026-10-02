// Role authorization middleware: Ensures the authenticated user has the required role
// Authentication (authMiddleware) checks *who* the user is via JWT.
// Authorization (roleMiddleware) checks *what* permissions the user has based on their role.
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // req.user is attached by authMiddleware
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({
        message: `Forbidden: ${requiredRole} access required`,
      });
    }
    next();
  };
};

module.exports = roleMiddleware;
