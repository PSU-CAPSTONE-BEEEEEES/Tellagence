/**
 * The actual value has a member with the given name.
 */
JsHamcrest.Matchers.hasMember = function(memberName, matcherOrValue) {
  var undefined;
  if (matcherOrValue === undefined) {
    matcherOrValue = JsHamcrest.Matchers.anything();
  } else if (!JsHamcrest.isMatcher(matcherOrValue)) {
    matcherOrValue = JsHamcrest.Matchers.equalTo(matcherOrValue);
  }

  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      if (actual && memberName in actual) {
        return matcherOrValue.matches(actual[memberName]);
      }
      return false;
    },

    describeTo: function(description) {
      description.append('has member ').appendLiteral(memberName)
        .append(' (').appendDescriptionOf(matcherOrValue).append(')');
    }
  });
};

/**
 * The actual value has a function with the given name.
 */
JsHamcrest.Matchers.hasFunction = function(functionName) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      if (actual) {
        return functionName in actual &&
            actual[functionName] instanceof Function;
      }
      return false;
    },

    describeTo: function(description) {
      description.append('has function ').appendLiteral(functionName);
    }
  });
};

/**
 * The actual value must be an instance of the given class.
 */
JsHamcrest.Matchers.instanceOf = function(clazz) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return !!(actual instanceof clazz);
    },

    describeTo: function(description) {
      var className = clazz.name ? clazz.name : 'a class';
      description.append('instance of ').append(className);
    }
  });
};

/**
 * The actual value must be an instance of the given type.
 */
JsHamcrest.Matchers.typeOf = function(typeName) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return (typeof actual == typeName);
    },

    describeTo: function(description) {
      description.append('typeof ').append('"').append(typeName).append('"');
    }
  });
};

/**
 * The actual value must be an object.
 */
JsHamcrest.Matchers.object = function() {
  return new JsHamcrest.Matchers.instanceOf(Object);
};

/**
 * The actual value must be a string.
 */
JsHamcrest.Matchers.string = function() {
  return new JsHamcrest.Matchers.typeOf('string');
};

/**
 * The actual value must be a number.
 */
JsHamcrest.Matchers.number = function() {
  return new JsHamcrest.Matchers.typeOf('number');
};

/**
 * The actual value must be a boolean.
 */
JsHamcrest.Matchers.bool = function() {
  return new JsHamcrest.Matchers.typeOf('boolean');
};

/**
 * The actual value must be a function.
 */
JsHamcrest.Matchers.func = function() {
  return new JsHamcrest.Matchers.instanceOf(Function);
};

