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
SimpleTest::prefer(new TextReporter());


class CanAddUp extends UnitTestCase {
    function testOneAndOneMakesTwo() {
        $this->assertEqual(1 + 1, 2);
    }
}

class testInput extends UnitTestCase {
    function testSanUsername(){
        $test = san('@abc ac');
        $this->assertIdentical($test[0], 'abc');

        $test = san('@abc12 45');
        $this->assertIdentical($test[0], 'abc12');

        $test = san('abc');
        $this->assertNull($test[0]);
    }

    function testTimeInside(){
        // Time detected
        $test = TimeInside('@11.30');
        $this->assertTrue($test);

        $test = TimeInside('@11:30');
        $this->assertTrue($test);

        // Not time
        $test = TimeInside('@abc ac');
        $this->assertFalse($test);

        $test = TimeInside('@11');
        $this->assertFalse($test);
    }

    function testremoveDuplication(){
        $e1[] = array(
                'user_id1' => '1',
                'user_id2' => '3',
                );
        $e2[] = array(
                'user_id1' => '1',
                'user_id2' => '2',
                );
        $e0[] = array(
               
                );
        $res[] = array(
                'user_id1' => '1',
                'user_id2' => '3',
                'inf_1to2' => '1',
                'inf_2to1' => '0',
                );
        $test = removeDuplication($e1, $e2);
        $this->assertEqual($test, $res);
        $test = removeDuplication($e1, $e0);
        $this->assertEqual($test, $res);

        $e3[] = array(
                'user_id1' => '1',
                'user_id2' => '3',
                );
        $e4[] = array(
                'user_id1' => '1',
                'user_id2' => '3',
                );
        $res1[] = array(
                'user_id1' => '1',
                'user_id2' => '3',
                'inf_1to2' => '1',
                'inf_2to1' => '1',
                );
        $test = removeDuplication($e3, $e4);
        $this->assertEqual($test, $res1);
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
/*
class WebTest extends WebTestCase {

    function testRedirects() {
        $this->get('http://localhost/capstone/data/unitTest.php');
        $this->assertResponse(200);
    }
}
*/



/*
class AllTests extends TestSuite {
    function AllTests() {
        $this->TestSuite('All tests');
        $this->addFile('log_test.php');
    }
}

class TestOfAbout extends WebTestCase {
    function testOurAboutPageGivesFreeReignToOurEgo() {
        $this->get('http://test-server/index.php');
        $this->click('About');
        $this->assertTitle('About why we are so great');
        $this->assertText('We are really great');
    }
}

*/
?>


