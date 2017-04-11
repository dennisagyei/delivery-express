var mongoose = require('mongoose');

var MetricSchema = new mongoose.Schema({
  rate: { type: Number },
  unit: { type: String }, //GHS OR %
  score: { type: Number },
  featured : { type: String },
  is_active : { type: String },
  ref_url : { type: String },
  logo : { type: String },
  comments : { type: String },
  kpi_id : { type: mongoose.Schema.Types.ObjectId },
  company_id : { type: mongoose.Schema.Types.ObjectId },
  company : String
},
{
  timestamps: true
});
// create model if not exists.
module.exports = mongoose.model('Metric', MetricSchema);
