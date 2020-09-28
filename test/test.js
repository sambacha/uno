"use strict";
var test = require('tap').test;
var uno = require('../index.js');
test('uno', function (t) {
    var f = 0;
    function fn(g) {
        t.equal(f, 0);
        f++;
        return f + g + this;
    }
    fn.ownProperty = {};
    var foo = uno(fn);
    t.equal(fn.ownProperty, foo.ownProperty);
    t.notOk(foo.called);
    for (var i = 0; i < 1E3; i++) {
        t.same(f, i === 0 ? 0 : 1);
        var g = foo.call(1, 1);
        t.ok(foo.called);
        t.same(g, 3);
        t.same(f, 1);
    }
    t.end();
});
test('uno.strict with named function', function (t) {
    var f = 0;
    function fn(g) {
        t.equal(f, 0);
        f++;
        return f + g + this;
    }
    fn.ownProperty = {};
    var foo = uno.strict(fn);
    t.equal(fn.ownProperty, foo.ownProperty);
    t.notOk(foo.called);
    var g = foo.call(1, 1);
    t.ok(foo.called);
    t.same(g, 3);
    t.same(f, 1);
    try {
        foo.call(2, 2);
        t.fail('strict uno should throw exception on second call');
    }
    catch (err) {
        t.ok(err instanceof Error);
        t.equal(err.message, "fn shouldn't be called more than uno");
        t.end();
    }
});
test('uno.strict with anonymous function', function (t) {
    var foo = uno.strict(function (g) {
        return g + 1;
    });
    t.notOk(foo.called);
    var g = foo(1);
    t.ok(foo.called);
    t.same(g, 2);
    try {
        foo(2);
        t.fail('strict uno should throw exception on second call');
    }
    catch (err) {
        t.ok(err instanceof Error);
        t.equal(err.message, "Function wrapped with `uno` shouldn't be called more than uno");
        t.end();
    }
});
test('uno.strict with custom error message', function (t) {
    var foo = uno.strict(function (g) {
        return g + 1;
    });
    foo.unoError = 'foo error';
    t.notOk(foo.called);
    var g = foo(1);
    t.ok(foo.called);
    t.same(g, 2);
    try {
        foo(2);
        t.fail('strict uno should throw exception on second call');
    }
    catch (err) {
        t.ok(err instanceof Error);
        t.equal(err.message, 'foo error');
        t.end();
    }
});
