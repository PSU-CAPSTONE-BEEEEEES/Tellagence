:mod:`JsHamcrest` --- Main Namespace
====================================

.. module:: JsHamcrest
   :synopsis: Main namespace, along with core abstractions.
.. moduleauthor:: Daniel Martins <daniel@destaquenet.com>


Provides the main namespace, along with core abstractions.

.. function:: areArraysEqual(array, anotherArray)

   Returns whether the arrays *array* and *anotherArray* are equivalent.

   :arg array:        An array.
   :arg anotherArray: Another array.
   :returns:          True if both arrays are equivalent; false otherwise.


.. function:: isMatcher(obj)

   Returns whether *obj* is a matcher.

   :arg obj: Object.
   :returns: True if the given object is a matcher; false otherwise.


.. data:: version

   Library version.


:class:`JsHamcrest.CombinableMatcher` Class
-------------------------------------------

.. class:: CombinableMatcher({matches, describeTo, describeValueTo})

   Extends :class:`JsHamcrest.SimpleMatcher`. Defines a composite matcher, that
   is, a matcher that wraps several matchers into one. 

   :arg matches:         Function that provides the matching logic.
   :arg describeTo:      Function that describes this matcher to a
                         :class:`JsHamcrest.Description`.
   :arg describeValueTo: *(Optional)* Function that describes the actual value
                         under test. If not provided, the actual value will be
                         described as a JavaScript literal.


.. function:: CombinableMatcher.and(matcherOrValue)

   Wraps this matcher and the given matcher using :meth:`JsHamcrest.Matchers.allOf`.

   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a
                        value.
   :returns:            Instance of :class:`JsHamcrest.CombinableMatcher`.


.. function:: CombinableMatcher.or(matcherOrValue)

   Wraps this matcher and the given matcher using :meth:`JsHamcrest.Matchers.anyOf`.

   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a
                        value.
   :returns:            Instance of :class:`JsHamcrest.CombinableMatcher`.


:class:`JsHamcrest.Description` Class
-------------------------------------

.. class:: Description()

   Extends :class:`Object`. Defines a textual description builder.


.. function:: Description.append(text)

   Appends *text* to this description.

   :arg text: Text to append to this description.
   :returns:  this.


.. function:: Description.appendDescriptionOf(selfDescribingObject)

   Appends the description of a *self describing object* to this description.

   :arg selfDescribingObject: Any object that have a :meth:`describeTo` function
                              that accepts a :class:`JsHamcrest.Description`
                              object as argument.
   :returns:                  this.


.. function:: Description.appendList(start, separator, end, list)

   Appends the description of several *self describing objects* to this
   description.

   :arg start:     Start string.
   :arg separator: Separator string.
   :arg end:       End string.
   :arg list:      Array of *self describing objects*. These objects must have
                   a :meth:`describeTo` function that accepts a
                   :class:`JsHamcrest.Description` object as argument.
   :returns:       this.


.. function:: Description.appendLiteral(literal)

   Appends a JavaScript language's *literal* to this description.

   :arg literal: Literal to append to this description.
   :returns:     this.


.. function:: Description.appendValueList(start, separator, end, list)

   Appends an array of values to this description.

   :arg start:     Start string.
   :arg separator: Separator string.
   :arg end:       End string.
   :arg list:      Array of values to be described to this description.
   :returns:       this.


.. function:: Description.get()

   Gets the current content of this description.

   :returns: Current content of this description.


:class:`JsHamcrest.SimpleMatcher` Class
---------------------------------------

.. class:: SimpleMatcher({matches, describeTo, describeValueTo})

   Extends :class:`Object`. Defines a matcher that relies on the external
   functions provided by the caller in order to shape the current matching
   logic.

   Below, an example of matcher that matches middle-aged people::

       var middleAged = new JsHamcrest.SimpleMatcher({
           matches: function(person) {
               return person.age >= 40 && person.age <= 60;
           },
           describeTo: function(description) {
               description.append('middle-aged');
           }
       });

       // Matcher usage
       middleAged.matches({name:'Gregory', age:50});  // Expected: true
       middleAged.matches({name:'Jeniffer', age:27}); // Expected: false

   :arg matches:         Function that provides the matching logic.
   :arg describeTo:      Function that describes this matcher to a
                         :class:`JsHamcrest.Description`.
   :arg describeValueTo: *(Optional)* Function that describes the actual value
                         under test. If not provided, the actual value will be
                         described as a JavaScript literal.


.. function:: SimpleMatcher.describeTo(description)

   Describes this matcher's tasks to *description*.

   :arg description: Instance of :class:`JsHamcrest.Description`.
   :returns:        Nothing.


.. function:: SimpleMatcher.describeValueTo(actual, description)

   Describes *actual* to *description*.

   :arg actual:     Actual value to be described.
   :arg description: Instance of :class:`JsHamcrest.Description`.
   :returns:        Nothing.


.. function:: SimpleMatcher.matches(actual)

   Checks if this matcher matches *actual*.

   :arg actual: Actual value.
   :returns:    True if the matcher matches the actual value; false otherwise.


.. seealso::
   :ref:`apiref`
