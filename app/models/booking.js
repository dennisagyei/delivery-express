var mongoose = require('mongoose');

var BookingSchema = new mongoose.Schema({
  booking_id: { type: Number },
  charge: { type: Number },
  delivery_date : { type: Date },
  pickup_date : { type: Date },
  start_loc: {type: [Number], required: true}, // [Long, Lat]
  drop_loc: {type: [Number], required: true}, // [Long, Lat]
  distance : Number, //in metres. divid by 1000 to get km
  duration : Number, // in seconds
  comments : { type: String },
  courier : { type: String },
  courier_id : { type: mongoose.Schema.Types.ObjectId },
  status : String,
  confirmed : Number
},
{
  timestamps: true
});
// Indexes this schema in 2dsphere format (critical for running proximity searches)
BookingSchema.index({start_loc: '2dsphere'});
// create model if not exists.
module.exports = mongoose.model('Booking', BookingSchema);
