const Album = require('../models/Album');

// @desc  Get all albums
// @route GET /api/albums
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({}).sort({ sortOrder: 1, createdAt: 1 });
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching albums', error: error.message });
  }
};

// @desc  Get single album by ID
// @route GET /api/albums/:id
const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching album', error: error.message });
  }
};

// @desc  Create album
// @route POST /api/albums
const createAlbum = async (req, res) => {
  try {
    const { name, slug, sortOrder, coverImageUrl } = req.body;
    const exists = await Album.findOne({ slug });
    if (exists) return res.status(400).json({ message: 'An album with this slug already exists' });

    const album = await Album.create({ name, slug, sortOrder, coverImageUrl });
    res.status(201).json(album);
  } catch (error) {
    res.status(400).json({ message: 'Error creating album', error: error.message });
  }
};

// @desc  Update album
// @route PUT /api/albums/:id
const updateAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.status(200).json(album);
  } catch (error) {
    res.status(400).json({ message: 'Error updating album', error: error.message });
  }
};

// @desc  Delete album
// @route DELETE /api/albums/:id
const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting album', error: error.message });
  }
};

module.exports = { getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum };
