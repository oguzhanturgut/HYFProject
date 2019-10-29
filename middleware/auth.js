const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).send({ msg: 'No token, authorization denied' });

  try {
    const decodedPayload = jwt.verify(token, config.get('jwtSecret'));
    req.user = decodedPayload.user;
    next();
  } catch (error) {
    return res.status(401).send({ msg: 'Invalid Token' });
  }
};
