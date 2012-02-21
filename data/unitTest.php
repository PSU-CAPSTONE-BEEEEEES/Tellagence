<?php
/**
 * Created by JetBrains PhpStorm.
 * User: letien
 * Date: 2/14/12
 * Time: 11:59 PM
 * To change this template use File | Settings | File Templates.
 */
require_once('simpletest/autorun.php');
require_once('simpletest/web_tester.php');


require_once('parse.php');
//SimpleTest::prefer(new TextReporter());

class CanAddUp extends UnitTestCase {
    function testOneAndOneMakesTwo() {
        $this->assertEqual(1 + 1, 2);
    }
}



/*
class FileTester extends UnitTestCase {

    function assertFileExists($filename = '', $message = '%s') {
        $this->assertTrue(
                file_exists($filename),
                sprintf($message, 'File [$filename] existence check'));
    }
}
*/

class WebTest extends WebTestCase {

    function testRedirects() {
        $this->get('http://localhost/capstone/data/unitTest.php');
        $this->assertResponse(200);
    }
}




/*
class AllTests extends TestSuite {
    function AllTests() {
        $this->TestSuite('All tests');
        $this->addFile('log_test.php');
    }
}
*/
?>


