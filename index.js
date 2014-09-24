var async = require('async');

var exports = module.exports = function () {
  
  var bundle = function (req, res, next) {
    
    async.eachSeries(bundle.layers, function (layer, done) {
      layer.handler(req, res, done);
    }, next);
  };
  
  bundle.layers = [];
  
  bundle.use = function (fn) {
    
    bundle.layers.push({
      name: null,
      handler: fn
    });
  };
  
  return bundle;
};