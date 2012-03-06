/**
 * The actual string must be equal to the given string, ignoring case.
 */
JsHamcrest.Matchers.equalIgnoringCase = function(str) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return actual.toUpperCase() == str.toUpperCase();
    },

    describeTo: function(description) {
      description.append('equal ignoring case "').append(str).append('"');
    }
  });
};

/**
 * The actual string must have a substring equals to the given string.
 */
JsHamcrest.Matchers.containsString = function(str) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return actual.indexOf(str) >= 0;
    },

    describeTo: function(description) {
      description.append('contains string "').append(str).append('"');
    }
  });
};

/**
 * The actual string must start with the given string.
 */
JsHamcrest.Matchers.startsWith = function(str) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return actual.indexOf(str) === 0;
    },

    describeTo: function(description) {
      description.append('starts with ').appendLiteral(str);
    }
  });
};

/**
 * The actual string must end with the given string.
 */
JsHamcrest.Matchers.endsWith = function(str) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return actual.lastIndexOf(str) + str.length == actual.length;
    },

    describeTo: function(description) {
      description.append('ends with ').appendLiteral(str);
    }
  });
};

/**
 * The actual string must match the given regular expression.
 */
JsHamcrest.Matchers.matches = function(regex) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return regex.test(actual);
    },

    describeTo: function(description) {
      description.append('matches ').appendLiteral(regex);
    }
  });
};

/**
 * The actual string must look like an e-mail address.
 */
JsHamcrest.Matchers.emailAddress = function() {
  var regex = /^([a-z0-9_\.\-\+])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i;

  return new JsHamcrest.SimpleMatcher({
    matches: function(actual) {
      return regex.test(actual);
    },

    describeTo: function(description) {
      description.append('email address');
    }
  });
};

