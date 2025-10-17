const Booking = require('../models/booking.model');
const Vehicle = require('../models/vehicle.model');

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function daysBetween(start, end) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((end.getTime() - start.getTime()) / msPerDay);
  return Math.max(1, days);
}

exports.createBooking = async (req, res) => {
  try {
    const { vehicleId, pickupDate, returnDate, location } = req.body;
    if (!vehicleId || !pickupDate || !returnDate) {
      return res.status(400).json({ error: { message: 'vehicleId, pickupDate, returnDate are required', code: 'BAD_REQUEST' } });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ error: { message: 'Vehicle not found', code: 'NOT_FOUND' } });

    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (!(start instanceof Date && !isNaN(start)) || !(end instanceof Date && !isNaN(end))) {
      return res.status(422).json({ error: { message: 'Invalid date format', code: 'VALIDATION_ERROR' } });
    }
    if (start >= end) {
      return res.status(422).json({ error: { message: 'pickupDate must be before returnDate', code: 'VALIDATION_ERROR' } });
    }

    const totalPrice = daysBetween(start, end) * vehicle.dailyRate;

    const booking = await Booking.create({
      vehicle: vehicle._id,
      customerId: req.user.id,
      pickupDate: start,
      returnDate: end,
      status: 'confirmed',
      totalPrice,
      location: location || vehicle.location || '',
    });

    res.status(201).json(await booking.populate('vehicle'));
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(422).json({ error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: err.errors } });
    }
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const customerId = req.user.id;

    const filter = { customerId };
    if (req.query.status) filter.status = req.query.status;

    const [data, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('vehicle').lean(),
      Booking.countDocuments(filter),
    ]);

    res.json({ data, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};

exports.listBookings = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const filter = {};
    const { status, vehicleId, customerId, dateFrom, dateTo } = req.query;
    if (status) filter.status = status;
    if (customerId) filter.customerId = customerId;
    if (vehicleId) filter.vehicle = vehicleId;
    if (dateFrom || dateTo) {
      filter.pickupDate = {};
      if (dateFrom) filter.pickupDate.$gte = new Date(dateFrom);
      if (dateTo) filter.pickupDate.$lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('vehicle').lean(),
      Booking.countDocuments(filter),
    ]);

    res.json({ data, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};
