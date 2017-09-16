var mongoose = require('mongoose');

var BookingSchema = new mongoose.Schema({
  booking_id: { type: Number },
  charge: { type: Number },
  delivery_date : { type: Date },
  pickup_date : { type: Date },
  start_loc : { type: String },
  drop_loc : { type: String },
  comments : { type: String },
  courier : { type: String },
  courier_id : { type: mongoose.Schema.Types.ObjectId },
  status : String
},
{
  timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('Booking', BookingSchema);
