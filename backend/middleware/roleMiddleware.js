export const allowRoles = (...roles) => {
  return (req, res, next) => {
    console.log(`Role Check: Required [${roles.join(", ")}], User has [${req.user.role}]`);
    if (!roles.includes(req.user.role)) {
      console.log("Access Denied: Role mismatch");
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
