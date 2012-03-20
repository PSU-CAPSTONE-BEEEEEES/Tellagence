IntegrationTest = TestCase("IntegrationTest");

IntegrationTest.prototype.testAssertion = function() {
  assertThat(5, between(0).and(10), "This assertion must succeed");
};

IntegrationTest.prototype.testFailedAssertion = function() {
  assertThat([], not(empty()), "This assertion must fail");
};
