/**
 * Created by andrewjjung on 2016-06-08.
 */

exports.adminOnly = function(req, res, next) {
  if (req.user.user_type === 'ADMIN') {
    next()
  }
  else {
    next(new Error(401))
  }
}

exports.adminOrInstructor = function(req, res, next) {
  if (req.user.user_type === 'ADMIN' || req.user.user_type == 'INSTRUCTOR') {
    next()
  }
  else {
    next(new Error(401))
  }
}

exports.selfOnly = function(req, res, next) {
  if (!req.params.user_id || (req.params.user_id === req.user._id.toString())) {
    next()
  }
  else {
    next(new Error(401)) 
  }
}
