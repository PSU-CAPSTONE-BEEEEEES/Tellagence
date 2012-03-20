.. _custom_matchers:

Writing Custom Matchers
=======================

JsHamcrest already provides a large set of matchers, but that doesn't mean you
should stick with those. In fact, we encourage you to create your own matchers
every time you feel the need for something more suitable to the problem you
have in hand.


A Basic Example
---------------

To introduce you to this topic, we are going to implement a new matcher whose
task is just say whether the actual number is the answer to life, the universe,
and everything. This is not a very useful matcher, but it shows everything you
need to create a basic matcher::

    var theAnswerToLifeTheUniverseAndEverything = function() {
        return new JsHamcrest.SimpleMatcher({
            matches: function(actual) {
                return actual == 42;
            },

            describeTo: function(description) {
                description.append('the answer to life, the universe, and everything');
            }
        });
    };


As you can see, a matcher is nothing more than a function that returns a
:class:`JsHamcrest.SimpleMatcher` object . All this particular matcher does is
test whether the actual number is equal to 42.

Okay, let's put that matcher to use::

    // Output: Expected the answer to life, the universe, and everything: Success
    assertThat(42, theAnswerToLifeTheUniverseAndEverything());

    // Output: Expected the answer to life, the universe, and everything but was 10
    assertThat(10, theAnswerToLifeTheUniverseAndEverything());


Do I Need Custom Matchers?
``````````````````````````

But wouldn't it be simpler if we just use the
:meth:`JsHamcrest.Matchers.equalTo` matcher instead? Let's see an example::

    // Output: Expected equal to 42: Success
    assertThat(42, equalTo(42));

    // Output: Expected equal to 42 but was 10
    assertThat(10, equalTo(42));


At the end, the result is the same. The only downside though is that we lose
the ability to describe the assertion with a meaningful language, more
appropriate to the problem we need to solve.


Composing Matchers
``````````````````

You can use your custom matchers together with the built-in ones to compose even
more interesting match rules. For example, if you want to match when a number
*is not* the answer to life, the universe, and everything, just wrap your custom
matcher with a :meth:`JsHamcrest.Matchers.not` matcher and you're done::

    // Output: Expected not the answer to life, the universe, and everything: Success
    assertThat(10, not(theAnswerToLifeTheUniverseAndEverything()));

    // Output: Expected not the answer to life, the universe, and everything but was 42
    assertThat(42, not(theAnswerToLifeTheUniverseAndEverything()));


That way you get the best of both worlds.


Learning By Example
-------------------

Another great way to learn how to implement new matchers is to look at the
:ref:`existing ones  <module_matchers>`. There's plenty of examples, of various
levels of complexity.

For instance, take a look at the source code of the
:meth:`JsHamcrest.Matchers.hasSize` matcher::

    JsHamcrest.Matchers.hasSize = function(matcherOrValue) {
        // Uses 'equalTo' matcher if the given object is not a matcher
        if (!JsHamcrest.isMatcher(matcherOrValue)) {
            matcherOrValue = JsHamcrest.Matchers.equalTo(matcherOrValue);
        }

        return new JsHamcrest.SimpleMatcher({
            matches: function(actual) {
                return matcherOrValue.matches(actual.length);
            },

            describeTo: function(description) {
                description.append('has size ').appendDescriptionOf(matcherOrValue);
            },

            describeValueTo: function(actual, description) {
                description.append(actual.length);
            }
        });
    };


This matcher is prepared to use either matchers or numbers as the expected
array size::

       assertThat([1,2,3], hasSize(3));
       assertThat([1,2,3], hasSize(lessThan(5)));


Distributing Your Custom Set Of Matchers
----------------------------------------

Let's suppose you have a couple of custom matchers you want to distribute to
some people::

    // filename: power_matchers.js

    PowerMatchers = {
        rocks: function() {
            // ...
        },

        sucks: function() {
            // ...
        }
    };


All you need to do is call :meth:`JsHamcrest.Integration.installMatchers` at the
end of your script, passing the namespace of your matchers as argument::

    // filename: power_matchers.js

    PowerMatchers = {
        // ...
    };

    JsHamcrest.Integration.installMatchers(PowerMatchers);


That's it. To plug your new matcher library, just link your script after
JsHamcrest itself:

.. code-block:: html

    <html>
    <header>
        <title>Page title</title>
        <script type="text/javascript" src="path/to/jshamcrest.js"></script>
        <script type="text/javascript" src="path/to/power_matchers.js"></script>

        <script type="text/javascript">
            // Displays the assertion descriptions using web browser's alert() function
            JsHamcrest.Integration.WebBrowser();

            var obj1 = {...}, obj2 = {...};

            assertThat(obj1, rocks());
            assertThat(obj2, sucks());
        </script>
    </header>
    <body>
    </body>
    </html>
