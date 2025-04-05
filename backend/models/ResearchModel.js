const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  file: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' }, // Referencing GridFS files
});

const Research = mongoose.model('Research', researchSchema);

module.exports = Research;
