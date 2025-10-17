const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

exports.list = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.q) {
      const q = String(req.query.q).trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }
    const [data, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    res.json({ data, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, role, password } = req.body || {};
    if (!name || !email || !role) {
      return res.status(400).json({ error: { message: 'name, email, role are required', code: 'BAD_REQUEST' } });
    }
    const exists = await User.findOne({ email: email.toLowerCase() }).lean();
    if (exists) return res.status(409).json({ error: { message: 'Email already exists', code: 'CONFLICT' } });
    const passwordHash = await bcrypt.hash(password || Math.random().toString(36).slice(2, 10), 10);
    const user = await User.create({ name, email, role, passwordHash });
    res.status(201).json(user.toSafeJSON());
  } catch (err) {
    const status = err.name === 'ValidationError' ? 422 : 500;
    const code = err.name === 'ValidationError' ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR';
    res.status(status).json({ error: { message: err.message, code } });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, isActive, password } = req.body || {};
    const update = {};
    if (name !== undefined) update.name = name;
    if (role !== undefined) update.role = role;
    if (isActive !== undefined) update.isActive = !!isActive;
    if (password) update.passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ error: { message: 'User not found', code: 'NOT_FOUND' } });
    res.json(user.toSafeJSON());
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: { message: 'User not found', code: 'NOT_FOUND' } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};
