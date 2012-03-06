JsHamcrest.Operators = {};

/**
 * Returns those items of the array for which matcher matches.
 */
JsHamcrest.Operators.filter = function(array, matcherOrValue) {
  if (!(array instanceof Array) || matcherOrValue == null) {
    return array;
  }
  if (!(matcherOrValue instanceof JsHamcrest.SimpleMatcher)) {
    matcherOrValue = JsHamcrest.Matchers.equalTo(matcherOrValue);
  }

  var result = [];
  for (var i = 0; i < array.length; i++) {
    if (matcherOrValue.matches(array[i])) {
      result.push(array[i]);
    }
  }
  return result;
};

/**
 * Generic assert function.
 */
JsHamcrest.Operators.assert = function(actualValue, matcherOrValue, options) {
  options = options ? options : {};
  var description = new JsHamcrest.Description();

  if (matcherOrValue == null) {
    matcherOrValue = JsHamcrest.Matchers.truth();
  } else if (!JsHamcrest.isMatcher(matcherOrValue)) {
    matcherOrValue = JsHamcrest.Matchers.equalTo(matcherOrValue);
  }

  if (options.message) {
    description.append(options.message).append('. ');
  }

  description.append('Expected ');
  matcherOrValue.describeTo(description);

  if (!matcherOrValue.matches(actualValue)) {
    description.passed = false;
    description.append(' but was ');
    matcherOrValue.describeValueTo(actualValue, description);
    if (options.fail) {
      options.fail(description.get());
    }
  } else {
    description.append(': Success');
    description.passed = true;
    if (options.pass) {
      options.pass(description.get());
    }
  }
  return description;
};

/**
 * Delegate function, useful when used along with raises() and raisesAnything().
 */
JsHamcrest.Operators.callTo = function() {
  var func = [].shift.call(arguments);
  var args = arguments;
  return function() {
    return func.apply(this, args);
  };
}

