var gpTile = com.ginpen.gpTile;

module('units', {
  setup: function() {
  },
  teardown: function() {
  }
});

test('general', function() {
  ok($().gpTile, 'jQuery.gpTile');
  ok(com.ginpen.gpTile, 'com.ginpen.gpTile');
});

test('find background-image url', function() {
  var $el = $('<div />')
    .css({ 'background-image': 'url(http://example.com/xxx.jpg)' })
    .appendTo('#qunit-fixture');
  equal(gpTile._getUrl($el), 'http://example.com/xxx.jpg', 'no quote');
  $el.remove();

  var $el = $('<div />')
    .css({ 'background-image': 'url("http://example.com/xxx.jpg")' })
    .appendTo('#qunit-fixture');
  equal(gpTile._getUrl($el), 'http://example.com/xxx.jpg', 'with quote');
  $el.remove();

  var $el = $('<div />')
    .css({ 'background': '#000 url(http://example.com/xxx.jpg) no-repeat fixed right bottom' })
    .appendTo('#qunit-fixture');
  equal(gpTile._getUrl($el), 'http://example.com/xxx.jpg', 'complex');
  $el.remove();

  var $el = $('<div />')
    .appendTo('#qunit-fixture');
  equal(gpTile._getUrl($el), '', 'empty');
  $el.remove();
});

test('check having directions', function() {
  ok(gpTile._hasDirectionX({ direction: 'x' }), 'x in x');
  ok(gpTile._hasDirectionX({ direction: 'X' }), 'x in X');
  ok(gpTile._hasDirectionX({ direction: 'yx' }), 'x in yx');
  ok(gpTile._hasDirectionX({ direction: 'xy' }), 'x in xy');
  ok(!gpTile._hasDirectionX({ direction: 'y' }), 'no x in X');
  ok(!gpTile._hasDirectionX({ direction: '' }), 'no x in empty');
  ok(!gpTile._hasDirectionX({}), 'no x in empty object');
  ok(!gpTile._hasDirectionX(), 'no x in null');

  ok(gpTile._hasDirectionY({ direction: 'y' }), 'y in x');
  ok(gpTile._hasDirectionY({ direction: 'Y' }), 'y in X');
  ok(gpTile._hasDirectionY({ direction: 'yx' }), 'y in yx');
  ok(gpTile._hasDirectionY({ direction: 'xy' }), 'y in xy');
  ok(!gpTile._hasDirectionY({ direction: 'x' }), 'no y in X');
  ok(!gpTile._hasDirectionY({ direction: '' }), 'no y in empty');
});

test('check having image size', function() {
  ok(gpTile._hasSize({ direction: 'xy', height: 1, width: 1 }), 'completely');
  ok(!gpTile._hasSize(), 'no settings');

  ok(!gpTile._hasSize({ height: 1 }), 'only height');
  ok(gpTile._hasSize({ direction: 'y', height: 1 }), 'only height with direction');
  ok(!gpTile._hasSize({ width: 1 }), 'only width');
  ok(gpTile._hasSize({ direction: 'x', width: 1 }), 'only width with direction');

  ok(!gpTile._hasSize({ direction: 'x', height: 0 }), 'zero height');
  ok(!gpTile._hasSize({ direction: 'x', height: 'x' }), 'NaN height');
  ok(!gpTile._hasSize({ direction: 'y', width: 0 }), 'zero width');
  ok(!gpTile._hasSize({ direction: 'y', width: 'x' }), 'NaN width');
});

test('get image size', function() {
  stop();
  var size = gpTile._getImgSize('bg.png', function(status, data) {
    equal(status, 'load', 'success');
    equal(data.width, 321, 'size');
    equal(data.height, 136, 'size');
    start();
  });

  stop();
  var size = gpTile._getImgSize('404.png', function(status, data) {
    equal(status, 'error', 'failer');
    start();
  });
});

test('get current size', function() {
  $el = $('<div />').css({ height: 600, width: 800 });
  var size = gpTile._getOwnSize($el);
  equal(size.height, 600, 'normal');
  equal(size.width, 800, 'normal');
});

test('calclate own size', function() {
  var ownSize = { height: 15, width: 14 };
  var imgSize = { height: 7, width: 13 };
  var size = gpTile._calclateOwnSize(ownSize, imgSize);
  equal(size.height, 21, 'own size');
  equal(size.width, 26, 'own size');

  var ownSize = { height: 14, width: 13 };
  var imgSize = { height: 7, width: 13 };
  var size = gpTile._calclateOwnSize(ownSize, imgSize);
  equal(size.height, 14, 'just');
  equal(size.width, 13, 'just');

  var ownSize = { height: 0, width: 0 };
  var imgSize = { height: 7, width: 13 };
  var size = gpTile._calclateOwnSize(ownSize, imgSize);
  equal(size.height, 7, 'zero');
  equal(size.width, 13, 'zero');
});

test("set size", function() {
  var $el = $('<div />')
    .css({ height: 1, width: 1, padding: '1px 2px 3px 4px' })
    .css({ 'font-size': '0' })  // for Quirks
    .appendTo('#qunit-fixture');
  gpTile._setSize($el, { height: 10, width: 13 });
  equal($el.height(), 6, 'with padding');
  equal($el.width(), 7, 'with padding');
});

// --------------------------------

module("jQuery interfaces");

test('adjust', function() {
  var $el = $('<div />')
    .css({ 'background-image': 'url(bg.png)', height: 1, width: 1 })
    .appendTo('#qunit-fixture');
  $el.gpTile();
  stop(1000);
  (function() {
    if ($el.height() == 136) {
      equal($el.height(), 136, 'size');
      equal($el.width(), 321, 'size');
      start();
      $el.remove();
    }
    else {
      setTimeout(arguments.callee, 10);
    }
  }());
});

test('specified size', function() {
  var $el = $('<div />')
    .css({ 'background-image': 'url(bg.png)', height: 1, width: 1 })
    .css({ 'font-size': '0' })  // for Quirks
    .appendTo('#qunit-fixture');
  $el.gpTile({ height: 7, width: 13 });
  equal($el.height(), 7, 'size');
  equal($el.width(), 13, 'size');
});

test('direction', function() {
  // Set 2px as minimum height because it will never 1 in Quirks.
  var $el = $('<div />')
    .css({ 'background-image': 'url(bg.png)', height: 2, width: 1 })
    .css({ 'font-size': '0' })  // for Quirks
    .appendTo('#qunit-fixture');
  $el.gpTile({ direction: 'x', height: 7, width: 13 });
  equal($el.height(), 2, 'x');
  equal($el.width(), 13, 'x');

  var $el = $('<div />')
    .css({ 'background-image': 'url(bg.png)', height: 1, width: 1 })
    .css({ 'font-size': '0' })  // for Quirks
    .appendTo('#qunit-fixture');
  $el.gpTile({ direction: 'y', height: 7, width: 13 });
  equal($el.height(), 7, 'y');
  equal($el.width(), 1, 'y');

  var $el = $('<div />')
    .css({ 'background-image': 'url(bg.png)', height: 1, width: 1 })
    .css({ 'font-size': '0' })  // for Quirks
    .appendTo('#qunit-fixture');
  $el.gpTile({ direction: 'xy', height: 7, width: 13 });
  equal($el.height(), 7, 'xy');
  equal($el.width(), 13, 'xy');

  var $el = $('<div />')
    .css({ 'background-image': 'url(bg.png)', height: 1, width: 1 })
    .css({ padding: '1px 2px 3px 4px' })
    .css({ 'font-size': '0' })  // for Quirks
    .appendTo('#qunit-fixture');
  $el.gpTile({ direction: 'y', height: 7, width: 13 });
  equal($el.height(), 3, 'padding');
  equal($el.width(), 1, 'padding');
});
