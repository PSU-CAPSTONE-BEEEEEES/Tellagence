new Test.Unit.Runner({
  name: 'Text matchers',

  setup: function() { with(this) {
  }},

  teardown: function() { with(this) {
  }},

  testEqualIgnoringCase: function() { with(this) {
    var equalIgnoringCase = JsHamcrest.Matchers.equalIgnoringCase;
    assert(equalIgnoringCase('TeSt').matches('tEsT'));
    assert(equalIgnoringCase(' Te St  ').matches(' tE sT  '));
    assert(!equalIgnoringCase('TeSt').matches('tEsT '));
    assert(!equalIgnoringCase('TeS1').matches('tEsT'));
  }},

  testContainsString: function() { with(this) {
    var containsString = JsHamcrest.Matchers.containsString;
    assert(containsString('st').matches('test'));
    assert(containsString('te').matches('test'));
    assert(!containsString('St').matches('test'));
    assert(!containsString('Te').matches('test'));
  }},

  testStartsWith: function() { with(this) {
    var startsWith = JsHamcrest.Matchers.startsWith;
    assert(startsWith('te').matches('test'));
    assert(startsWith('  t e').matches('  t est'));
    assert(!startsWith('es').matches('test'));
    assert(!startsWith(' t e').matches('  t est'));
  }},

  testEndsWith: function() { with(this) {
    var endsWith = JsHamcrest.Matchers.endsWith;
    assert(endsWith('est').matches('test'));
    assert(endsWith(' st  ').matches('te st  '));
    assert(!endsWith(' st').matches('test'));
    assert(!endsWith(' st ').matches('te st  '));
  }},

  testMatches: function() { with(this) {
    var matches = JsHamcrest.Matchers.matches;
    var regex = /\b0[xX][0-9a-fA-F]+\b/;
    assert(matches(regex).matches('0xb4dcaf3'));
    assert(matches(regex).matches('0XB4DCAF3'));
    assert(!matches(regex).matches(''));
    assert(!matches(regex).matches('0x'));
    assert(!matches(regex).matches('0x4head'));
  }},

  testEmailAddress: function() { with(this) {
    var emailAddress = JsHamcrest.Matchers.emailAddress;
    assert(emailAddress().matches('user@domain.com'));
    assert(emailAddress().matches('user.name@domain.com.uk'));
    assert(emailAddress().matches('user.name+tag@domain.com'));
    assert(!emailAddress().matches('domain'));
    assert(!emailAddress().matches('domain.com'));
    assert(!emailAddress().matches('user@domain'));
    assert(!emailAddress().matches('user&name@domain.com'));
  }}
}, {'testLog': 'textLog'});
