new Test.Unit.Runner({
  name: 'Matcher operators',

  setup: function() { with(this) {
  }},

  teardown: function() { with(this) {
  }},

  testFilterWithInvalidArray: function() { with(this) {
    var array = 'Invalid Array';
    assertIdentical(array, filter(array, even()));
  }},

  testFilterWithoutMatcher: function() { with(this) {
    var array = [1,2,3];
    assertIdentical(array, filter(array));
  }},

  testFilterWithValue: function() { with(this) {
    var array = [1,2,3];
    assertEnumEqual([1], filter(array, '1'));
    assertEnumEqual([], filter(array, 0));
  }},

  testFilter: function() { with(this) {
    var array = [0,1,2,3,4,5,6,7,8,9];
    assertEnumEqual([2,4,6,8], filter(array, both(even()).and(greaterThan(0))));

    matcher = JsHamcrest.Matchers.greaterThan(10);
    assertEnumEqual([], filter(array, matcher));
  }},

  testAssertWithoutMessageAndCallbacks: function() { with(this) {
    var iAssertThat = JsHamcrest.Operators.assert;
    assert(iAssertThat('10', equalTo(10)).passed);
    assert(!iAssertThat('05', equalTo(10)).passed);
  }},

  testAssertWithValue: function() { with(this) {
    var iAssertThat = JsHamcrest.Operators.assert;
    assert(iAssertThat('10', 10).passed);
    assert(!iAssertThat('05', 10).passed);
  }},

  testAssertActualValue: function() { with(this) {
    var iAssertThat = JsHamcrest.Operators.assert;
    var undefined;

    assert(iAssertThat(10).passed);
    assert(iAssertThat('10').passed);
    assert(!iAssertThat(0).passed);
    assert(!iAssertThat('').passed);
    assert(!iAssertThat(null).passed);
    assert(!iAssertThat(undefined).passed);
    assert(!iAssertThat().passed);
  }},

  testAssertSuccessWithMessage: function() { with(this) {
    var message = '';
    var iAssertThat = function(actual, matcher, message) {
      return JsHamcrest.Operators.assert(actual, matcher, {
        message: message
      });
    };

    result = iAssertThat('10', equalTo(10))
    assert(result.passed);
    assert(result.get().indexOf('With message') == -1);

    result = iAssertThat('10', equalTo(10), 'With message');
    assert(result.passed);
    assert(result.get().indexOf('With message') >= 0);
  }},

  testAssertFailureWithMessage: function() { with(this) {
    var message = '';
    var iAssertThat = function(actual, matcher, message) {
      return JsHamcrest.Operators.assert(actual, matcher, {
        message: message
      });
    };

    result = iAssertThat('05', equalTo(10))
    assert(!result.passed);
    assert(result.get().indexOf('With message') == -1);

    result = iAssertThat('05', equalTo(10), 'With message');
    assert(!result.passed);
    assert(result.get().indexOf('With message') >= 0);
  }},

  testAssertWithCallbacks: function() { with(this) {
    var passed = false;
    var iAssertThat = function(actual, matcher, message) {
      return JsHamcrest.Operators.assert(actual, matcher, {
        fail: function() {
          passed = false;
        },
        pass: function() {
          passed = true;
        }
      });
    };

    result = iAssertThat('10', equalTo(10));
    assert(passed);
    assert(result.passed);

    result = iAssertThat('05', equalTo(10));
    assert(!passed);
    assert(!result.passed);
  }},

  testAssertWithMessageAndCallbacks: function() { with(this) {
    var passed = false;
    var message = '';
    var iAssertThat = function(actual, matcher, msg) {
      return JsHamcrest.Operators.assert(actual, matcher, {
        message: msg,
        fail: function(msg) {
          passed = false;
          message = msg;
        },
        pass: function(msg) {
          passed = true;
          message = msg;
        }
      });
    };

    result = iAssertThat('10', equalTo(10), 'With message');
    assert(passed);
    assert(message.indexOf('With message') >= 0)
    assert(result.passed);

    result = iAssertThat('05', equalTo(10), 'With message');
    assert(!passed);
    assert(message.indexOf('With message') >= 0)
    assert(!result.passed);
  }},

  testCallToWithNoArgs: function() { with(this) {
    var fn = callTo(parseInt);
    assert(isNaN(fn()));
  }},

  testCallToWithArgs: function() { with(this) {
    var fn = callTo(parseInt, "2");
    assertIdentical(fn(), 2);
  }}
}, {'testLog': 'operatorLog'});
