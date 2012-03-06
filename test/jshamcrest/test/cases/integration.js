var logFailures = function(self, func) {
  var failCount = 0;
  var result;
  try {
    self.oldFail = self.fail;
    self.fail = function(message) {
      failCount++;
    };
    result = func();
  } finally {
    self.fail = self.oldFail;
  }

  return {result: result, failCount: failCount};
};

new Test.Unit.Runner({
  name: 'Integration',

  setup: function() { with(this) {
  }},

  teardown: function() { with(this) {
  }},

  testCopyDefaultMembers: function() { with(this) {
    var dst = {a:1};
    JsHamcrest.Integration.copyMembers(dst);
    assertEqual(1, dst.a);
    assert(dst.equalTo instanceof Function);
    assert(dst.filter instanceof Function);
  }},

  testCopyExistentMembers: function() { with(this) {
    var src = {a:1, b:2, c:3}, dst = {a:2};
    JsHamcrest.Integration.copyMembers(src, dst);
    assertEqual(dst.a, 2);
    assertEqual(dst.b, 2);
    assertEqual(dst.c, 3);
  }},

  testCopyMembers: function() { with(this) {
    var src = {b:2, c:3}, dst = {a:1};
    
    JsHamcrest.Integration.copyMembers(src, dst);
    assertEqual(dst.a, 1);
    assertEqual(dst.b, 2);
    assertEqual(dst.c, 3);
  }},

  testAssertThatWithSuccessfulMatcherAndNoMessage: function() { with(this) {
    var description = assertThat(10, greaterThan(0));
    assertEqual('Expected greater than 0: Success', description.get());
  }},

  testAssertThatWithSuccessfulMatcherAndMessage: function() { with(this) {
    var description = assertThat(10, greaterThan(0), 'some text');
    assertEqual('some text. Expected greater than 0: Success', description.get());
  }},

  testAssertThatWithFailedMatcherAndNoMessage: function() { with(this) {
    var data = logFailures(this, function() {
      return assertThat(10, lessThan(0));
    });
    assertEqual(1, data.failCount);
    assertEqual('Expected less than 0 but was 10', data.result.get());
  }},

  testAssertThatWithFailedMatcherAndMessage: function() { with(this) {
    var data = logFailures(this, function() {
      return assertThat(10, lessThan(0), 'some text');
    });
    assertEqual(1, data.failCount);
    assertEqual('some text. Expected less than 0 but was 10', data.result.get());
  }},

  testAssertThatWithSuccessfulValueAndNoMessage: function() { with(this) {
    var description = assertThat(10, '10');
    assertEqual('Expected equal to "10": Success', description.get());
  }},

  testAssertThatWithSuccessfulValueAndMessage: function() { with (this) {
    var description = assertThat(10, '10', 'some text');
    assertEqual('some text. Expected equal to "10": Success', description.get());
  }},

  testAssertThatWithFailedValueAndNoMessage: function() { with(this) {
    var data = logFailures(this, function() {
      return assertThat(10, 0);
    });
    assertEqual(1, data.failCount);
    assertEqual('Expected equal to 0 but was 10', data.result.get());
  }},

  testAssertThatWithFailedValueAndMessage: function() { with(this) {
    var data = logFailures(this, function() {
      return assertThat(10, '00', 'some text');
    });
    assertEqual(1, data.failCount);
    assertEqual('some text. Expected equal to "00" but was 10', data.result.get());
  }},

  testAssertThatWithTrueActualAndNoMatcher: function() { with(this) {
    var description = assertThat(10);
    assertEqual('Expected truth: Success', description.get());
  }},

  testAssertThatWithFalseActualAndNoMatcher: function() { with(this) {
    var data = logFailures(this, function() {
      return assertThat(0);
    });

    assertEqual(1, data.failCount);
    assertEqual('Expected truth but was 0', data.result.get());
  }}
}, {'testLog': 'integrationLog'});
