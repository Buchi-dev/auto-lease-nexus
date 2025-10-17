const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vehicle.controller');
const { authRequired, requireRoles } = require('../middlewares/auth.middleware');

// List with filters/sort/pagination
router.get('/', ctrl.listVehicles);

// Get by id
router.get('/:id', ctrl.getVehicleById);

// Create (staff/admin only)
router.post('/', authRequired, requireRoles('admin', 'staff'), ctrl.createVehicle);

// Update (admin/staff only)
router.put('/:id', authRequired, requireRoles('admin', 'staff'), ctrl.updateVehicle);

// Delete (admin only)
router.delete('/:id', authRequired, requireRoles('admin'), ctrl.deleteVehicle);

module.exports = router;
