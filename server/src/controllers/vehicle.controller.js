const Vehicle = require('../models/vehicle.model');

function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function parseSort(sortBy) {
  switch (sortBy) {
    case 'rating':
      return { rating: -1 };
    case 'price_asc':
      return { dailyRate: 1 };
    case 'price_desc':
      return { dailyRate: -1 };
    case 'year_desc':
      return { year: -1 };
    case 'year_asc':
      return { year: 1 };
    case 'popular':
    default:
      return { rating: -1, year: -1 };
  }
}

exports.listVehicles = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req);

    const {
      category,
      transmission,
      fuelType,
      seatsMin,
      seatsMax,
      status,
      location,
      minRate,
      maxRate,
      search,
      sortBy,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (transmission) filter.transmission = transmission;
    if (fuelType) filter.fuelType = fuelType;
    if (status) filter.status = status;
    if (location) filter.location = location;

    if (seatsMin || seatsMax) {
      filter.seats = {};
      if (seatsMin) filter.seats.$gte = Number(seatsMin);
      if (seatsMax) filter.seats.$lte = Number(seatsMax);
    }

    if (minRate || maxRate) {
      filter.dailyRate = {};
      if (minRate) filter.dailyRate.$gte = Number(minRate);
      if (maxRate) filter.dailyRate.$lte = Number(maxRate);
    }

    if (search) {
      filter.$or = [
        { make: new RegExp(search, 'i') },
        { model: new RegExp(search, 'i') },
      ];
    }

    const sort = parseSort(sortBy);

    const [data, total] = await Promise.all([
      Vehicle.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Vehicle.countDocuments(filter),
    ]);

    res.json({ data, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const v = await Vehicle.findById(req.params.id).lean();
    if (!v) return res.status(404).json({ error: { message: 'Vehicle not found', code: 'NOT_FOUND' } });
    res.json(v);
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const v = await Vehicle.create(req.body);
    res.status(201).json(v);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(422).json({ error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: err.errors } });
    }
    res.status(500).json({ error: { message: err.message, code: 'INTERNAL_ERROR' } });
  }
};
