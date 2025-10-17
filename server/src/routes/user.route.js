const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authRequired, requireRoles } = require('../middlewares/auth.middleware');

// All routes below are admin-only
router.use(authRequired, requireRoles('admin'));

router.get('/', UserController.list);
router.post('/', UserController.create);
router.patch('/:id', UserController.update);
router.delete('/:id', UserController.remove);

module.exports = router;
