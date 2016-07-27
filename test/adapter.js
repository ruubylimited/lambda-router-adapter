var assert = require('assert');
var express = require('express');

describe('LambdaRouterAdapter', function() {
  describe('index', function () {
    it('should compile', function () {
      require('../');
    });

    it('should handle an express request with binary response', function (done) {
      var index = require('../');
      var app = express();
      var data = 'DATA';

      app.get('/status', function(req, res){
        res.header('Content-Type', 'image/png');
        res.send(data);
      });

      index.newExpressHandler(app)({url: '/status', method: 'GET'}, {done: function(error, lambdaResponse) {
        assert.ifError(error);
        assert.equal(data, new Buffer(lambdaResponse.bodyBase64, 'base64').toString());
        done();
      }});
    });

    it('should handle an express request with html response', function (done) {
      var index = require('../');
      var app = express();
      var data = '<h1>OK</h1>';

      app.get('/status', function(req, res){
        res.send(data);
      });

      index.newExpressHandler(app)({url: '/status', method: 'GET'}, {done: function(error, lambdaResponse) {
        assert.ifError(error);
        assert.equal(data, lambdaResponse.body);
        done();
      }});
    });

    it('should handle an express request with json response', function (done) {
      var index = require('../');
      var app = express();
      var data = {hello: 'world'};

      app.get('/status', function(req, res){
        res.json(data);
      });

      index.newExpressHandler(app)({url: '/status', method: 'GET'}, {done: function(error, lambdaResponse) {
        assert.ifError(error);
        assert.deepEqual(data, lambdaResponse.body);
        done();
      }});
    });

    it('should 404', function (done) {
      var index = require('../');
      var app = express();

      app.get('/status', function(req, res){
        res.send('OK');
      });

      app.use(function(req, res){
        res.status(404).send('NotFound');
      });

      index.newExpressHandler(app)({url: '/test', method: 'GET'}, {done: function(error, lambdaResponse) {
        assert.ifError(error);
        assert.equal(404, lambdaResponse.statusCode);
        done();
      }});
    });
  });

  describe('request', function () {
    it('should compile', function () {
      require('../request');
    });
  });

  describe('response', function () {
    it('should compile', function () {
      require('../response');
    });

    it('should have functioning headers', function () {
      var response = require('../response');
      var r = response.newResponse(function() {});
      r.setHeader('test', 'value');
      assert.equal(r.getHeader('test'), 'value');
    });
  });

  describe('contentTypes', function () {
    it('should compile', function () {
      require('../contentTypes');
    });

    it('should detect a text content type', function () {
      var contentTypes = require('../contentTypes');
      assert(contentTypes.isText('text/plain'));
      assert(!contentTypes.isText('application/octetstream'));
    });
  });
});
