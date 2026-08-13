const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} = require('../controllers/albumController');

router.route('/').get(getAlbums).post(protect, createAlbum);
router.route('/:id').get(getAlbumById).put(protect, updateAlbum).delete(protect, deleteAlbum);

module.exports = router;
