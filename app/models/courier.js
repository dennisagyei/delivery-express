var mongoose = require('mongoose');

var CourierSchema = new mongoose.Schema({
  name: { type: String },
  charge: { type: Number },
  contact : { type: String },
  comments : String
},
{
  timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('Courier', CourierSchema);
