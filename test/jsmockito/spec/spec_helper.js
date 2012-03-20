// vi:ts=2 sw=2 expandtab
JsHamcrest.Integration.screwunit();
JsMockito.Integration.screwunit();

Screw.Matchers.throwsMessage = function(exceptionText) {
  return new JsHamcrest.SimpleMatcher({
    matches: function(actualFunction) {
      try {
        actualFunction();
      } catch (e) {
        if (JsHamcrest.Matchers.equalTo(exceptionText).matches(e)) {
          return true;
        } else {
          throw e;
        }
      }
      return false;
    },

    describeTo: function(description) {
      description.append('throws "').append(exceptionText).append('"');
    }
  });
}

var MyObject = function() {};
MyObject.prototype = {
  greeting: function() { return "hello" },
  farewell: function() { return "goodbye" }
};
