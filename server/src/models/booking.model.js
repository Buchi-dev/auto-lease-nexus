const { Schema, model, Types } = require('mongoose');

const BookingSchema = new Schema(
  {
    vehicle: { type: Types.ObjectId, ref: 'Vehicle', required: true },
    customerId: { type: String, required: true }, // For now keep as string to match client mock
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'], default: 'pending' },
    totalPrice: { type: Number, required: true, min: 0 },
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

BookingSchema.index({ vehicle: 1, pickupDate: 1, returnDate: 1 });

module.exports = model('Booking', BookingSchema);
