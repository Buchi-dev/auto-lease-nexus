const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/booking.controller');
const { authRequired, requireRoles } = require('../middlewares/auth.middleware');

// Create booking (customer)
router.post('/', authRequired, requireRoles('customer', 'admin', 'staff'), ctrl.createBooking);

// List my bookings (auth user)
router.get('/my', authRequired, ctrl.getMyBookings);

// Admin/staff list all bookings
router.get('/', authRequired, requireRoles('admin', 'staff'), ctrl.listBookings);

module.exports = router;
