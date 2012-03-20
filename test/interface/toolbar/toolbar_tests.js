// tests for the progressCallback
test("progressCallback test", function() {
    // mock out disablePopup to track when it's called
    disablePopup = JsMockito.mockFunction();

    // set up fake data
    var testData = {running_value: 99};
    var testDataPass = {running_value: 100};

    // test conditional by checking if disablePopup was called or not
    progressCallback(testData);
    JsMockito.verifyZeroInteractions(disablePopup);

    progressCallback(testDataPass);
    JsMockito.verify(disablePopup)();
});
