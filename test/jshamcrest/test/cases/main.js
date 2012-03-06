new Test.Unit.Runner({
  name: 'Core abstractions',

  setup: function() { with(this) {
    description = new JsHamcrest.Description();
    testCase = new JsUnitTest.Unit.Testcase();
    selfDescribing = {
      describeTo: function(description) {
        description.append('description');
      }
    };
  }},

  teardown: function() { with(this) {
  }},

  testIsMatcher: function() { with(this) {
    function CustomMatcher() { };
    CustomMatcher.prototype = new JsHamcrest.SimpleMatcher();

    assert(JsHamcrest.isMatcher(new CustomMatcher()));
    assert(!JsHamcrest.isMatcher({}));
  }},

  testAreArraysEqual: function() { with(this) {
    var areArraysEqual = JsHamcrest.areArraysEqual;
    assert(!areArraysEqual([], {}));
    assert(!areArraysEqual([1,2], [1]));
    assert(!areArraysEqual([[1],1], [[1],2]));
    assert(!areArraysEqual([1,[2,3]], [1,['2',2]]));

    assert(areArraysEqual());
    assert(areArraysEqual(null, undefined));
    assert(areArraysEqual([], []));
    assert(areArraysEqual([1,'2'], ['1',2]));
    assert(areArraysEqual(['1',[2,3]], [1,['2','3']]));
  }},

  testCreateSimpleMatcher: function() { with(this) {
    function matches(actual) { };
    function describeTo(description) { };
    var matcher = new JsHamcrest.SimpleMatcher({
      matches: matches,
      describeTo: describeTo
    });

    assertIdentical(matches, matcher.matches);
    assertIdentical(describeTo, matcher.describeTo);
  }},

  testCreateCombinableMatcher: function() { with(this) {
    function matches(actual) { };
    function describeTo(description) { };
    var matcher = new JsHamcrest.CombinableMatcher({
      matches: matches,
      describeTo: describeTo
    });

    assertIdentical(matches, matcher.matches);
    assertIdentical(describeTo, matcher.describeTo);

    assert(matcher.and);
    assert(matcher.or);

    assertInstanceOf(JsHamcrest.CombinableMatcher, matcher.and(50));
    assertInstanceOf(JsHamcrest.CombinableMatcher, matcher.or(50));
  }},

  testDescriptionAppend: function() { with(this) {
    description.append();
    assertEqual('', description.get());

    description.append(null);
    assertEqual('', description.get());

    description.append(0);
    assertEqual('0', description.get());

    description.append('text');
    assertEqual('0text', description.get());

    description.append(null);
    assertEqual('0text', description.get());
  }},

  testDescriptionAppendLiteral: function() { with(this) {
    var undefined;
    var obj = {
      toString: function() {
        return 'Object';
      }
    };
    var value = [obj, '1', 2, null, undefined, [], function() { }, function foo() { }];
    var expected = '[Object, "1", 2, null, undefined, [], Function, Function foo]';

    description.appendLiteral(value);
    assertEqual(expected, description.get());
  }},

  testDescriptionAppendDescriptionOf: function() { with(this) {
    description.appendDescriptionOf(null);
    assertEqual('', description.get());

    description.appendDescriptionOf(selfDescribing);
    assertEqual('description', description.get());
  }},

  testDescriptionAppendList: function() { with(this) {
    description.appendList('[', '-', ']', [selfDescribing, null, selfDescribing]);
    assertEqual('[description--description]', description.get());
  }},

  testDescriptionAppendValueList: function() { with(this) {
    description.appendValueList('[', '-', ']', [1,'a',null,undefined]);
    assertEqual('[1-"a"-null-undefined]', description.get());
  }}
}, {'testLog': 'mainLog'});
