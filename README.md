# bundles

Flexible standalone middleware stacker with hooks. This is useful for bundling together functionality as one standalone middleware for use with other modules like [Connect](https://www.npmjs.org/package/connect) or [Express](https://www.npmjs.org/package/express).

Bundles provides hooks so that you can inject functionality after the middleware has been bundled together. This is useful for third parties to hook into your bundled middleware.

## Install

```
npm install bundles --save
```

## Usage

Basic

```js
var bundles = require('bundles');
var connect = require('connect');

var bundle = bundles();

bundle.use(function (req, res, next) {
  // do something
  next();
});

app.use(bundle);

app.listen(3000, function () {
  
});
```

Hooks and named middleware

```js
var bundles = require('bundles');
var connect = require('connect');

var bundle = bundles();

bundle.use('bundle1', function (req, res, next) {
  // do something
  next();
});

bundle.useBefore('bundle1', function (req, res, next) {
  // executes before bundle1
  next();
});

bundle.useAfter('bundle1', function (req, res, next) {
  // executes after bundle1
  next();
});

app.use(bundle);

app.listen(3000, function () {
  
});
```

## Run Tests

```
npm install
npm test
```