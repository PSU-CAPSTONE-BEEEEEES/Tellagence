Uses Of JsHamcrest
==================

Now that you're getting familiar with JsHamcrest, you might be wondering if it
can be used to do any *real* work. Here goes some situations where you might
find JsHamcrest useful.


Unit Testing
------------

JsHamcrest *is not* a testing framework, but the matcher library provided by
JsHamcrest is very useful for testing since you can build really expressive
test assertions.

For example, take a look at this `QUnit`_-based test suite::

    // Integrates JsHamcrest with QUnit
    JsHamcrest.Integration.QUnit();

    $(document).ready(function(){
        test("Array might be empty", function() {
            assertThat([], empty());
        });

        test("Array might not be empty", function() {
            assertThat([1,2,3], not(empty()));
        });
    });


Besides `QUnit`_, JsHamcrest integrates with several other JavaScript testing
frameworks.

.. seealso::
   :mod:`JsHamcrest.Integration` namespace.


Mocking Frameworks
``````````````````

To further improve your JavaScript testing experience, `Chris Leishman`_ created
a stub/mock framework called `JsMockito`_, which uses the matchers provided by
JsHamcrest under the hood.


Object Filtering
----------------

Another great use of matchers is to easily filter lists of objects according to
specific rules.

For example, let's suppose you have a list of objects that represents a people
database::

    var people = [
        {name: 'Daniel',  gender: 'M', age: 20},
        {name: 'Anthony', gender: 'M', age: 52},
        {name: 'Alicia',  gender: 'F', age: 37},
        {name: 'Maria',   gender: 'F', age: 46},
        {name: 'Carl',    gender: 'M', age: 30},
        {name: 'Nicky',   gender: 'F', age: 27}
    ];


Let's create some matchers to be able to filter people by gender or age::

    var CustomMatchers = {
        male: function() {
            return new JsHamcrest.SimpleMatcher({
                matches: function(person) {
                    return person.gender == 'M';
                }
            });
        },

        female: function() {
            return new JsHamcrest.SimpleMatcher({
                matches: function(person) {
                    return person.gender == 'F';
                }
            });
        },

        middleAged: function() {
            return new JsHamcrest.SimpleMatcher({
                matches: function(person) {
                    return person.age >= 40 && person.age <= 60;
                }
            });
        }
    };

    JsHamcrest.Integration.installMatchers(CustomMatchers);


.. seealso::
   :ref:`custom_matchers`.


That's all it takes! Now let's filter some data::

    // First, let's make all JsHamcrest stuff globally accessible
    JsHamcrest.Integration.copyMembers(this);

    filter(people, male());            // Daniel, Anthony, Carl
    filter(people, female());          // Alicia, Maria, Nicky
    filter(people, middleAged());      // Anthony, Maria
    filter(people, not(middleAged())); // Daniel, Alicia, Carl, Nicky

    filter(people, either(middleAged()).or(female())); // Anthony, Alicia, Maria, Nicky
    filter(people, either(male()).or(middleAged()));   // Daniel, Anthony, Maria, Carl

    filter(people, both(middleAged()).and(female()));  // Maria
    filter(people, both(male()).and(middleAged()));    // Anthony


Et Cetera
---------

We are sure JsHamcrest can do a lot more than what's shown here. If you are
doing something else with JsHamcrest, please :ref:`let us know <getting_involved>`!


.. _QUnit: http://docs.jquery.com/QUnit
.. _Chris Leishman: http://chrisleishman.com/
.. _JsMockito: http://jsmockito.org/
