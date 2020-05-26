const mongoose = require('mongoose');
const mongoolia = require('mongoolia').default;
const Schema = mongoose.Schema;

// create a schema
const articleSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  startDate: {type: Date, required: true},
  editDate: {type: Date},
  tag: { type: Array },
  rating: { type: Number },
  like: { type: Object },
  bookmark: { type: Number },
  creator: { type: String },
  comment: { type: Object },
}, { collection: 'article' });
const Article = mongoose.model('Article', articleSchema);


module.exports = Article;
