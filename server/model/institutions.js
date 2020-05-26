const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const institutionSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  photoUrl: { type: String },
  foundation: { type: Number },
  city: { type: String },
  status: {type: String},
  createdArticle: { type: Array },
  likedArticle: { type: Array },
  marksArticle: { type: Array },
  rating: {type: Number},
  part: {type: Object},
  description: {type: String}
}, { collection: 'institution' });


const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;