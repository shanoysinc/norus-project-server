export function authRole(role) {
  return (req, res, next) => {
    if (req.user.userRole !== role) {
      res.status(401).send("Not allowed");
    }

    next();
  };
}
