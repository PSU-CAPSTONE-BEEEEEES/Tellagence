:mod:`JsHamcrest.Operators` --- Matcher Operators
=================================================

.. module:: JsHamcrest.Operators
   :synopsis: Operator functions for matchers.
.. moduleauthor:: Daniel Martins <daniel@destaquenet.com>


Provides utilitary functions on top of matchers.


List Processing
---------------

.. function:: filter(array, matcherOrValue)

   Returns those items of *array* for which *matcherOrValue* matches::

       var filtered = filter([0,1,2,3,4,5,6], even());
       assertThat(filtered, equalTo([0,2,4,6]));

       var filtered = filter([0,1,2,'1',0], 1);
       assertThat(filtered, equalTo([1,'1']));

   :arg array:          Array of items to be filtered.
   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a
                        value.
   :returns:            Filtered array.


Unit Testing
------------

.. function:: assert(actualValue, matcherOrValue[, {fail, pass, message}])

   Generic assert function to be used for easy integration with testing
   frameworks. Usage example::

       // Add the following method to your testing framework...

       function iAssertThat(actualValue, matcherOrValue, message) {
           return JsHamcrest.Operators.assert(actualValue, matcherOrValue, {
               message: message,
               fail: function(failMessage) {
                   // Forward the call to the appropriate method provided by the testing framework
                   myTestingFramework.fail(failMessage);
               },
               pass: function(passMessage) {
                   // Forward the call to the appropriate method provided by the testing framework
                   myTestingFramework.pass(passMessage);
               }
           });
       }

       // ...and then you'll be able to leverage the power of JsHamcrest in your test cases
       result = iAssertThat(50, between(0).and(100));

       result.passed // Output: true
       result.get()  // Output: "50 between 0 and 100: Success"

   :arg actualValue:    Actual value.
   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a
                        value.
   :arg fail:           *(Optional)* Callback function to be called when
                        *actualValue* doesn't match *matcherOrValue*.
   :arg pass:           *(Optional)* Callback function to be called when
                        *actualValue* does match *matcherOrValue*.
   :arg message:        *(Optional)* Text that describes the assertion on an
                        even higher level.
   :returns:            Instance of :class:`JsHamcrest.Description` with the
                        assertion description. Also, the result of the assertion
                        (success or failure/error) can be accessed through the
                        :attr:`passed` attribute.


.. function:: callTo(func[, arg...])

   Returns a zero-args function that calls the function *func* with the given
   *args*::

       var func = callTo(parseInt, "2");
       assertThat(func(), sameAs(2));

   This is specially useful when used along with :meth:`JsHamcrest.Matchers.raises`
   or :meth:`JsHamcrest.Matchers.raisesAnything`::

       assertThat(callTo(myFunc, arg1, arg2), raisesAnything());

   :arg func: Function to delegate calls to.
   :arg arg:  Optional arguments to *func*.
   :returns:  Function that delegates calls to *func*.


.. seealso::
   :ref:`apiref`
