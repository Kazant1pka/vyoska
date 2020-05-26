const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  photoUrl: { type: String },
  age: { type: Number },
  city: { type: String },
  status: {type: String},
  createdArticle: { type: Array },
  likedArticle: { type: Array },
  marksArticle: { type: Array },
  rating: {type: Number},
  university: {type: String},
  grade: {type: String}
}, { collection: 'users' });


const User = mongoose.model('User', userSchema);

module.exports = User;