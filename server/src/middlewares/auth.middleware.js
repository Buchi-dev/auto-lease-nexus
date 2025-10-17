const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Object.assign(new Error('JWT_SECRET is not configured'), { status: 500, code: 'CONFIG_ERROR' });
  }
  return secret;
}

exports.authRequired = async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: { message: 'Missing token', code: 'UNAUTHORIZED' } });

    const payload = jwt.verify(token, getJwtSecret());
    // Fetch user with minimal fields
    const user = await User.findById(payload.sub).lean();
    if (!user || user.isActive === false) {
      return res.status(401).json({ error: { message: 'User not found or inactive', code: 'UNAUTHORIZED' } });
    }
    req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email };
    next();
  } catch (err) {
    const status = err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' ? 401 : (err.status || 500);
    const code = status === 401 ? 'UNAUTHORIZED' : (err.code || 'INTERNAL_ERROR');
    res.status(status).json({ error: { message: err.message, code } });
  }
};

exports.requireRoles = function requireRoles(...roles) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Forbidden', code: 'FORBIDDEN' } });
    }
    next();
  };
};
