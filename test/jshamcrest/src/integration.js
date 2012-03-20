/**
 * Integration utilities.
 */

JsHamcrest.Integration = (function() {

  var self = this;

  return {

    /**
     * Copies all members of an object to another.
     */
    copyMembers: function(source, target) {
      if (arguments.length == 1) {
        target = source;
        JsHamcrest.Integration.copyMembers(JsHamcrest.Matchers, target);
        JsHamcrest.Integration.copyMembers(JsHamcrest.Operators, target);
      } else if (source) {
        for (var method in source) {
          if (!(method in target)) {
            target[method] = source[method];
          }
        }
      }
    },

    /**
     * Adds the members of the given object to JsHamcrest.Matchers
     * namespace.
     */
    installMatchers: function(matchersNamespace) {
      var target = JsHamcrest.Matchers;
      JsHamcrest.Integration.copyMembers(matchersNamespace, target);
    },

    /**
     * Adds the members of the given object to JsHamcrest.Operators
     * namespace.
     */
    installOperators: function(operatorsNamespace) {
      var target = JsHamcrest.Operators;
      JsHamcrest.Integration.copyMembers(operatorsNamespace, target);
    },

    /**
     * Uses the web browser's alert() function to display the assertion
     * results. Great for quick prototyping.
     */
    WebBrowser: function() {
      JsHamcrest.Integration.copyMembers(self);

      self.assertThat = function (actual, matcher, message) {
        return JsHamcrest.Operators.assert(actual, matcher, {
          message: message,
          fail: function(message) {
            alert('[FAIL] ' + message);
          },
          pass: function(message) {
            alert('[SUCCESS] ' + message);
          }
        });
      };
    },

    /**
     * Uses the Rhino's print() function to display the assertion results.
     * Great for prototyping.
     */
    Rhino: function() {
      JsHamcrest.Integration.copyMembers(self);

      self.assertThat = function (actual, matcher, message) {
        return JsHamcrest.Operators.assert(actual, matcher, {
          message: message,
          fail: function(message) {
            print('[FAIL] ' + message + '\n');
          },
          pass: function(message) {
            print('[SUCCESS] ' + message + '\n');
          }
        });
      };
    },

    /**
     * JsTestDriver integration.
     */
    JsTestDriver: function(params) {
      params = params ? params : {};
      var target = params.scope || self;

      JsHamcrest.Integration.copyMembers(target);

      // Function called when an assertion fails.
      function fail(message) {
        var exc = new Error(message);
        exc.name = 'AssertError';

        try {
          // Removes all jshamcrest-related entries from error stack
          var re = new RegExp('jshamcrest.*\.js\:', 'i');
          var stack = exc.stack.split('\n');
          var newStack = '';
          for (var i = 0; i < stack.length; i++) {
            if (!re.test(stack[i])) {
              newStack += stack[i] + '\n';
            }
          }
          exc.stack = newStack;
        } catch (e) {
          // It's okay, do nothing
        }
        throw exc;
      }

      // Assertion method exposed to JsTestDriver.
      target.assertThat = function (actual, matcher, message) {
        return JsHamcrest.Operators.assert(actual, matcher, {
          message: message,
          fail: fail
        });
      };
    },

    /**
     * JsUnitTest integration.
     */
    JsUnitTest: function(params) {
      params = params ? params : {};
      var target = params.scope || JsUnitTest.Unit.Testcase.prototype;

      JsHamcrest.Integration.copyMembers(target);

      // Assertion method exposed to JsUnitTest.
      target.assertThat = function (actual, matcher, message) {
        var self = this;

        return JsHamcrest.Operators.assert(actual, matcher, {
          message: message,
          fail: function(message) {
            self.fail(message);
          },
          pass: function() {
            self.pass();
          }
        });
      };
    },

    /**
     * YUITest (Yahoo UI) integration.
     */
    YUITest: function(params) {
      params = params ? params : {};
      var target = params.scope || self;

      JsHamcrest.Integration.copyMembers(target);

      target.Assert = YAHOO.util.Assert;

      // Assertion method exposed to YUITest.
      YAHOO.util.Assert.that = function(actual, matcher, message) {
        return JsHamcrest.Operators.assert(actual, matcher, {
          message: message,
          fail: function(message) {
            YAHOO.util.Assert.fail(message);
          }
        });
      };
    },

    /**
     * QUnit (JQuery) integration.
     */
    QUnit: function(params) {
      params = params ? params : {};
      var target = params.scope || self;

      JsHamcrest.Integration.copyMembers(target);

      // Assertion method exposed to QUnit.
      target.assertThat = function(actual, matcher, message) {
        return JsHamcrest.Operators.assert(actual, matcher, {
          message: message,
          fail: function(message) {
            QUnit.ok(false, message);
          },
          pass: function(message) {
            QUnit.ok(true, message);
          }
        });
      };
    },

    /**
     * jsUnity integration.
     */
    jsUnity: function(params) {
      params = params ? params : {};
      var target = params.scope || jsUnity.env.defaultScope;
      var assertions = params.attachAssertions || false;

      JsHamcrest.Integration.copyMembers(target);

      if (assertions) {
        jsUnity.attachAssertions(target);
      }

      // Assertion method exposed to jsUnity.
      target.assertThat = function(actual, matcher, message) {
        return JsHamcrest.Operators.assert(actual, matcher, {
          message: message,
          fail: function(message) {
            throw message;
          }
        });
      };
    },

    /**
     * Screw.Unit integration.
     */
    screwunit: function(params) {
      params = params ? params : {};
      var target = params.scope || Screw.Matchers;

      JsHamcrest.Integration.copyMembers(target);

      // Assertion method exposed to Screw.Unit.
      target.assertThat = function(actual, matcher, message) {
        return JsHamcrest.Operators.assert(actual, matcher, {
          message: message,
          fail: function(message) {
            throw message;
          }
        });
      };
    },

    /**
     * Jasmine integration.
     */
    jasmine: function(params) {
      params = params ? params : {};
      var target = params.scope || self;

      JsHamcrest.Integration.copyMembers(target);

      // Assertion method exposed to Jasmine.
      target.assertThat = function(actual, matcher, message) {
        return JsHamcrest.Operators.assert(actual, matcher, {
          message: message,
          fail: function(message) {
            jasmine.getEnv().currentSpec.addMatcherResult(
              new jasmine.ExpectationResult({passed:false, message:message})
            );
          },
          pass: function(message) {
            jasmine.getEnv().currentSpec.addMatcherResult(
              new jasmine.ExpectationResult({passed:true, message:message})
            );
          }
        });
      };
    }
  };
})();

