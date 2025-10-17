const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

function signToken(user) {
  const payload = { sub: String(user._id), role: user.role };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  if (!secret) throw Object.assign(new Error('JWT_SECRET is not configured'), { status: 500, code: 'CONFIG_ERROR' });
  return jwt.sign(payload, secret, { expiresIn });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: { message: 'name, email, password are required', code: 'BAD_REQUEST' } });
    }
    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return res.status(409).json({ error: { message: 'Email already in use', code: 'CONFLICT' } });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: role || 'customer' });
    const token = signToken(user);
    res.status(201).json({ user: user.toSafeJSON(), token });
  } catch (err) {
    const status = err.name === 'ValidationError' ? 422 : (err.status || 500);
    const code = err.name === 'ValidationError' ? 'VALIDATION_ERROR' : (err.code || 'INTERNAL_ERROR');
    res.status(status).json({ error: { message: err.message, code, details: err.errors || undefined } });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: { message: 'email and password are required', code: 'BAD_REQUEST' } });
    }
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select('+passwordHash');
    if (!user) return res.status(401).json({ error: { message: 'Invalid credentials', code: 'UNAUTHORIZED' } });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials', code: 'UNAUTHORIZED' } });
    const token = signToken(user);
    res.json({ user: user.toSafeJSON(), token });
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};

exports.me = async (req, res) => {
  try {
    // Assumes authRequired middleware populated req.user
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(401).json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};

exports.logout = async (_req, res) => {
  // Stateless JWT; client should discard token
  res.json({ ok: true });
};
