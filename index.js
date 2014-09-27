// Intercept request and response objects
require('http-intercept');
var async = require('async');

module.exports = function () {
  
  var bundle = function (req, res, next) {
    
    // Handle response modifers/interceptors first
    res.intercept(function (ctx) {
      
      bundle._responseModifiers.forEach(function (modifier) {
        
        ctx.buffer = modifier.handler(ctx.buffer.toString(), req, res);
      });
    });
    
    // Execute stack
    bundle._executeStack(bundle._stack, req, res, next);
  };
  
  bundle._stack = [];
  bundle._before = {};
  bundle._after = {};
  bundle._responseModifiers = [];
  
  bundle._executeStack = function (stack, req, res, stackExecuationDone) {
    
    async.eachSeries(stack, function (layer, layerExecutionDone) {
      
      if (typeof layer.handler !== 'function') {
        return next(new Error('Missing middleware handler'));
      }
      
      var befores = bundle._before[layer.name] || [];
      var afters = bundle._after[layer.name] || [];
      
      async.series({
        before: function (next) {
          
          bundle._executeStack(befores, req, res, next);
        },
        layer: function (next) {
          layer.handler(req, res, next);
        },
        after: function (next) {
          
          bundle._executeStack(afters, req, res, next);
        },
      }, layerExecutionDone);
    }, stackExecuationDone);
  }
  
  bundle.use = function (name, fn) {
    
    // No name
    if (arguments.length === 1) {
      fn = name;
    }
    
    bundle._stack.push({
      name: name,
      handler: fn
    });
    
    // Set up stack layer for hooks
    if (name) {
      bundle._before[name] = [];
      bundle._after[name] = [];
    }
    
    return bundle;
  };
  
  bundle.useBefore = function (bundleName, fn) {
    
    bundle._before[bundleName].push({
      handler: fn
    });
    
    return bundle;
  };
  
  bundle.useAfter = function (bundleName, fn) {
    
    bundle._after[bundleName].push({
      handler: fn
    });
    
    return bundle;
  };
  
  bundle.onResponse = function (modifyFn) {
    
    bundle._responseModifiers.push({
      handler: modifyFn
    });
    
    // TODO: test this chaining
    return bundle;
  };
  
  return bundle;
};