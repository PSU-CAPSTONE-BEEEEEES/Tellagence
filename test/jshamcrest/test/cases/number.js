new Test.Unit.Runner({
  name: 'Number matchers',

  setup: function() { with(this) {
  }},

  teardown: function() { with(this) {
  }},

  testGreaterThan: function() { with(this) {
    var greaterThan = JsHamcrest.Matchers.greaterThan;
    assert(greaterThan(5).matches(6));
    assert(!greaterThan(5).matches(5));
    assert(!greaterThan(5).matches(4));
  }},

  testGreaterThanOrEqualTo: function() { with(this) {
    var greaterThanOrEqualTo = JsHamcrest.Matchers.greaterThanOrEqualTo;
    assert(greaterThanOrEqualTo(5).matches(6));
    assert(greaterThanOrEqualTo(5).matches(5));
    assert(!greaterThanOrEqualTo(5).matches(4));
  }},

  testLessThan: function() { with(this) {
    var lessThan = JsHamcrest.Matchers.lessThan;
    assert(lessThan(5).matches(4));
    assert(!lessThan(5).matches(5));
    assert(!lessThan(5).matches(6));
  }},

  testLessThanOrEqualTo: function() { with(this) {
    var lessThanOrEqualTo = JsHamcrest.Matchers.lessThanOrEqualTo;
    assert(lessThanOrEqualTo(5).matches(4));
    assert(lessThanOrEqualTo(5).matches(5));
    assert(!lessThanOrEqualTo(5).matches(6));
  }},

  testNotANumber: function() { with(this) {
    var notANumber = JsHamcrest.Matchers.notANumber;
    assert(notANumber().matches('A'));
    assert(notANumber().matches(Math.sqrt(-1)));
    assert(!notANumber().matches('10'));
    assert(!notANumber().matches(50));
  }},

  testDivisibleBy: function() { with(this) {
    var divisibleBy = JsHamcrest.Matchers.divisibleBy;
    assert(divisibleBy(3).matches(27));
    assert(divisibleBy(3).matches(-15));
    assert(!divisibleBy(2).matches(27));
    assert(!divisibleBy(2).matches(-15));
  }},

  testEven: function() { with(this) {
    var even = JsHamcrest.Matchers.even;
    assert(even().matches(-2));
    assert(even().matches(2));
    assert(!even().matches(-1));
    assert(!even().matches(1));
  }},

  testOdd: function() { with(this) {
    var odd = JsHamcrest.Matchers.odd;
    assert(odd().matches(-1));
    assert(odd().matches(1));
    assert(!odd().matches(-2));
    assert(!odd().matches(2));
  }},

  testBetween: function() { with(this) {
    var between = JsHamcrest.Matchers.between;
    var range = between(5).and(10);
    assert(range.matches(5));
    assert(range.matches(8));
    assert(range.matches(10));
    assert(!range.matches(4));
    assert(!range.matches(11));
  }},

  testCloseTo: function() { with(this) {
    var close = JsHamcrest.Matchers.closeTo(1.0, 0.5);
    assert(close.matches(1.0));
    assert(close.matches(0.5));
    assert(close.matches(1.5));
    assert(!close.matches(2.0));
    assert(!close.matches(0.0));
  }},

  testZero: function() { with(this) {
    var zero = JsHamcrest.Matchers.zero();
    assert(zero.matches(0));
    assert(!zero.matches('0'));
    assert(!zero.matches(null));
  }}
}, {'testLog': 'numberLog'});
