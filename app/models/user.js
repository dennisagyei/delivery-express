var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({

  local: {
        name         : String,
        email        : String,
        password     : String,
  },
  facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
  },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
  },
  google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
  },
  phone: String,
  earnedRatings: Number,
  totalRatings: Number,
  usertype: String,
  location: {
    index: '2dsphere',
    type: String,
    address:  String,
    coordinates: [Number]
  }
  
},
{
  timestamps: true
});


 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// checking if password is valid using bcrypt
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// create model if not exists.
module.exports = mongoose.model('User', UserSchema);
