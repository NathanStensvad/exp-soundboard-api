const UsersService = require('./users-service');

function generateToken(user) {
  return JSON.stringify({ userId: user.id });
}

function decryptToken(token) {
  return JSON.parse(token);
}

function requireAuth(req, res, next) {
  const authHeader = req.get('Authorization');

  if (!authHeader)
    return res.status(400).json({
      error: "Missing Authorization header"
    });

  const token = authHeader.slice('Bearer '.length);

  const data = decryptToken(token);  // { userId: 1 }

  if (!data)
    return res.status(400).json({
      error: "Invalid token"
    });

  return UsersService.getById(req.app.get('db'), data.userId).then(
    (user) => {
      if (!user)
        return res.status(401).json({
          error: "Invalid token"
        });

      res.user = user;
      next();
    });
}

module.exports = {
  requireAuth,
  generateToken
}