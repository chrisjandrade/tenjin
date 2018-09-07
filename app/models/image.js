const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  file: String,
  mimeType: String,
  metadata: { type: Array, default: [] }
});

const ImageModel = mongoose.model('Image', ImageSchema);

module.exports = { ImageSchema, ImageModel };