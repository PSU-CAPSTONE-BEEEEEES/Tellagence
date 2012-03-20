load("../qunit/qunit/qunit.js");
load("../src/myLib.js");

var stop_watch = {
    start_time: null, stop_time: null,

    start: function() {
	this.start_time = new Date();
    },

    stop: function() {
	this.stop_time = new Date();
    },

    elapsed_seconds: function() {
	return ( this.stop_time.getMilliseconds() - this.start_time.getMilliseconds() ) / 1000;
    }
};

(function() {

    var out = (typeof println !== "undefined") ? println : print;

    QUnit.init();
    QUnit.config.blocking = true;
    QUnit.config.autorun = true;
    QUnit.config.updateRate = 0;

    // Hack for Rhino's error objects
    var current_object_parser = QUnit.jsDump.parsers.object;
    QUnit.jsDump.setParser('object', function(obj) {
	if(typeof obj.rhinoException !== 'undefined') {
	    return obj.name + " { message: '" + obj.message + "', fileName: '" + obj.fileName + "', lineNumber: " + obj.lineNumber + " }";
	}
	else {
	    return current_object_parser(obj);
	}
    });

    var current_test_name = null;
    var current_test_assertions = [];
    var totals = { pass: 0, fail: 0};

    QUnit.testStart = function(name) {
	current_test_name = name;
	current_test_assertions = [];
    };

    QUnit.testDone = function(name, fail_count, total_count) {
	if(fail_count > 0) {
	    out("FAIL - " + name);

	    for(var i = 0; i < current_test_assertions.length; i++) {
		out("    " + current_test_assertions[i]);
	    }


	    totals.fail = totals.fail + 1;
	}
	else {
	    out("PASS - " + name);
	    totals.pass = totals.pass + 1;
	}
    };

    QUnit.log = function(result, message, details) {
	details.message = details.message || "";

	var type = (typeof details.expected !== "undefined") ? "EQ" : "OK";

	var outcome = result ? "PASS" : "FAIL";
	
	var response = "";
	if(!result && typeof details.expected !== "undefined") {
	    response = "Expected: " + details.expected + ", Actual: " + details.actual;
	}

	current_test_assertions.push([outcome, type, details.message, response].join("|"));
    };

    QUnit.done = function() {
	stop_watch.stop();

	out("----------------------------------------");
	out(" PASS: " + totals.pass + "  FAIL: " + totals.fail + "  TOTAL: " + (totals.pass + totals.fail));
	out(" Finished in " + stop_watch.elapsed_seconds() + " seconds.");
	out("----------------------------------------");
    };

    QUnit.begin = function() {
	stop_watch.start();
    }

})();

// run the tests
load("../test/myLibTest.js");
load("../qunit/test/test.js");

QUnit.begin(); // hacked b/c currently QUnit.begin is normally called on document.load
QUnit.start();
