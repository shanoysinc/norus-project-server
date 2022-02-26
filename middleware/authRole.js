export function authRole(role) {
  return (req, res, next) => {
    if (req.user.userRole !== role) {
      return res.status(401).send("Not allowed");
    }

    next();
  };
}
