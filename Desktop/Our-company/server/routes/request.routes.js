const express = require('express');
const router = express.Router();
const { createRequest, getRequests, getRequest, updateRequestStatus, deleteRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.post('/', createRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequest);
router.patch('/:id/status', protect, updateRequestStatus);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
