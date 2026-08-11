const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sortOrder: { type: Number, default: 0 },
  coverImageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);