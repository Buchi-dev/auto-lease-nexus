const { Schema, model } = require('mongoose');

const VehicleSchema = new Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1990, max: new Date().getFullYear() + 1 },
    category: { type: String, enum: ['sedan', 'suv', 'luxury', 'sports', 'van'], required: true },
    image: { type: String, default: '' },
    dailyRate: { type: Number, required: true, min: 0 },
    transmission: { type: String, enum: ['automatic', 'manual'], required: true },
    fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid'], required: true },
    seats: { type: Number, default: 4, min: 1 },
    status: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' },
    location: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    features: { type: [String], default: [] },
  },
  { timestamps: true }
);

VehicleSchema.index({ make: 1, model: 1, year: -1 });
VehicleSchema.index({ category: 1, status: 1 });

module.exports = model('Vehicle', VehicleSchema);
