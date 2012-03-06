.. _module_matchers:

:mod:`JsHamcrest.Matchers` --- Built-in Matchers
================================================

.. module:: JsHamcrest.Matchers
   :synopsis: Built-in matcher library.
.. moduleauthor:: Daniel Martins <daniel@destaquenet.com>


Built-in matcher library.


Collection Matchers
-------------------

.. function:: empty()

   The length of the actual value must be zero::

       assertThat([], empty());
       assertThat('', empty());

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: everyItem(matcherOrValue)

   The actual value should be an array and *matcherOrValue* must match all
   items::

       assertThat([1,2,3], everyItem(greaterThan(0)));
       assertThat([1,'1'], everyItem(1));

   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a
                        value.
   :returns:            Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: hasItem(matcherOrValue)

   The actual value should be an array and it must contain at least one value
   that matches *matcherOrValue*::

       assertThat([1,2,3], hasItem(equalTo(3)));
       assertThat([1,2,3], hasItem(3));

   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a
                        value.
   :returns:            Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: hasItems(MatchersOrValues...)

   The actual value should be an array and *matchersOrValues* must match at
   least one item::

       assertThat([1,2,3], hasItems(2,3));
       assertThat([1,2,3], hasItems(greaterThan(2)));
       assertThat([1,2,3], hasItems(1, greaterThan(2));

   :arg MatchersOrValues: Matchers and/or values.
   :returns:              Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: hasSize(matcherOrValue)

   The length of the actual value value must match *matcherOrValue*::

       assertThat([1,2,3], hasSize(3));
       assertThat([1,2,3], hasSize(lessThan(5)));
       assertThat('string', hasSize(6));
       assertThat('string', hasSize(greaterThan(3)));
       assertThat({a:1, b:2}, hasSize(equalTo(2)));

   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a
                        value.
   :returns:            Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: isIn(item...)

   The given array or arguments must contain the actual value::

       assertThat(1, isIn([1,2,3]));
       assertThat(1, isIn(1,2,3));

   :arg item...: Array or list of values.
   :returns:     Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: oneOf()

   Alias to :meth:`isIn` function.


Core Matchers
-------------

.. function:: allOf(matchersOrValues...)

   All *matchesOrValues* must match the actual value. This matcher behaves
   pretty much like the JavaScript ``&&`` (and) operator::

       assertThat(5, allOf([greaterThan(0), lessThan(10)]));
       assertThat(5, allOf([5, lessThan(10)]));
       assertThat(5, allOf(greaterThan(0), lessThan(10)));
       assertThat(5, allOf(5, lessThan(10)));

   :arg matchersOrValues: Instances of :class:`JsHamcrest.SimpleMatcher` and/or
                          values.
   :returns:              Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: anyOf(matchersOrValues)

   At least one of the *matchersOrValues* should match the actual value. This
   matcher behaves pretty much like the ``||`` (or) operator::

       assertThat(5, anyOf([even(), greaterThan(2)]));
       assertThat(5, anyOf(even(), greaterThan(2)));

   :arg matchersOrValues: Instances of :class:`JsHamcrest.SimpleMatcher` and/or
                          values.
   :returns:              Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: anything()

   Useless always-match matcher::

       assertThat('string', anything());
       assertThat(null, anything());

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: both(matcherOrValue)

   Combinable matcher where the actual value must match all the given matchers
   or values::

       assertThat(10, both(greaterThan(5)).and(even()));

   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a
                        value.
   :returns:            Instance of :class:`JsHamcrest.CombinableMatcher`.


.. function:: either(matcherOrValue)

   Combinable matcher where the actual value must match at least one of the
   given matchers or values::

       assertThat(10, either(greaterThan(50)).or(even()));

   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a
                        value.
   :returns:            Instance of :class:`JsHamcrest.CombinableMatcher`.


.. function:: equalTo(expected)

   The actual value must be equal to *expected*::

       assertThat('10', equalTo(10));

   :arg expected: Expected value.
   :returns:      Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: is(matcherOrValue)

   Delegate-only matcher frequently used to improve readability::

       assertThat('10', is(10));
       assertThat('10', is(equalTo(10)));

   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a 
                        value.
   :returns:            Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: nil()

   The actual value must be ``null`` or ``undefined``::

       var undef;
       assertThat(undef, nil());
       assertThat(null, nil());

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: not(matcherOrValue)

   The actual value must not match *matcherOrValue*::

       assertThat(10, not(20));
       assertThat(10, not(equalTo(20)));

   :arg matcherOrValue: Instance of :class:`JsHamcrest.SimpleMatcher` or a 
                        value.
   :returns:            Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: raises(exceptionName)

   The actual value is a function and, when invoked, it should thrown an
   exception with the given name::

       var MyException = function(message) {
           this.name = 'MyException';
           this.message = message;
       };

       var myFunction = function() {
           // Do something dangerous...
           throw new MyException('Unexpected error');
       };
 
       assertThat(myFunction, raises('MyException'));

   :arg exceptionName: Name of the expected exception.
   :returns:           Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: raisesAnything()

   The actual value is a function and, when invoked, it should raise any
   exception::

       var myFunction = function() {
           // Do something dangerous...
           throw 'Some unexpected error';
       };

       assertThat(myFunction, raisesAnything());

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: sameAs(expected)

   The actual value must be the same as *expected*::

       var number = 10, anotherNumber = number;
       assertThat(number, sameAs(anotherNumber));

   :arg expected: Expected value.
   :returns:      Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: truth()

   The actual value must be any value considered truth by the JavaScript engine::

       var undef;
       assertThat(10, truth());
       assertThat({}, truth());
       assertThat(0, not(truth()));
       assertThat('', not(truth()));
       assertThat(null, not(truth()));
       assertThat(undef, not(truth()));

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


Number Matchers
---------------

.. function:: between(start)

   The actual number must be between the given range (inclusive)::

       assertThat(5, between(4).and(7));

   :arg start: Range start.
   :returns:   Builder object with an :meth:`end` method, which returns a
               :class:`JsHamcrest.SimpleMatcher` instance and thus should be
               called to finish the matcher creation.


.. function:: closeTo(expected[, delta])

   The actual number must be close enough to *expected*, that is, the actual
   number is equal to a value within some range of acceptable error::

       assertThat(0.5, closeTo(1.0, 0.5));
       assertThat(1.0, closeTo(1.0, 0.5));
       assertThat(1.5, closeTo(1.0, 0.5));
       assertThat(2.0, not(closeTo(1.0, 0.5)));

   :arg expected: Expected number.
   :arg delta:    *(Optional, default=0)* Expected difference delta.
   :returns:      Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: divisibleBy(divisor)

   The actual value must be divisible by *divisor*::

       assertThat(21, divisibleBy(3));

   :arg divisor: Divisor.
   :returns:     Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: even()

   The actual number must be even::

       assertThat(4, even());

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: greaterThan(expected)

   The actual number must be greater than *expected*::

       assertThat(10, greaterThan(5));

   :arg expected: Expected number.
   :returns:      Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: greaterThanOrEqualTo(expected)

   The actual number must be greater than or equal to *expected*::

       assertThat(10, greaterThanOrEqualTo(5));

   :arg expected: Expected number.
   :returns:      Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: lessThan(expected)

   The actual number must be less than *expected*::

       assertThat(5, lessThan(10));

   :arg expected: Expected number.
   :returns:      Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: lessThanOrEqualTo(expected)

   The actual number must be less than or equal to *expected*::

       assertThat(5, lessThanOrEqualTo(10));

   :arg expected: Expected number.
   :returns:      Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: notANumber()

   The actual value must not be a number::

       assertThat(Math.sqrt(-1), notANumber());

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: odd()

   The actual number must be odd::

       assertThat(5, odd());

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: zero()

   The actual number must be zero::

       assertThat(0, zero());
       assertThat('0', not(zero()));

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


Object Matchers
---------------

.. function:: bool()

   The actual value must be a boolean::

       assertThat(true, bool());
       assertThat(false, bool());
       assertThat("text" not(bool()));

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: func()

   The actual value must be a function::

       assertThat(function() {}, func());
       assertThat("text", not(func()));

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: hasFunction(functionName)

   The actual value has a function with the given name::

       var greeter = {
           sayHello: function(name) {
               alert('Hello, ' + name);
           }
       };
       
       assertThat(greeter, hasFunction('sayHello'));

   :arg functionName: Function name.
   :returns:          Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: hasMember(memberName[, matcherOrValue])

   The actual value has an attribute with the given name::

       var greeter = {
           marco: 'polo',
           sayHello: function(name) {
               alert('Hello, ' + name);
           }
       };
       
       assertThat(greeter, hasMember('marco'));
       assertThat(greeter, hasMember('sayHello'));

   It's also possible to match the member's value if necessary::

       assertThat(greeter, hasMember('marco', equalTo('polo')));

   :arg memberName:     Member name.
   :arg matcherOrValue: Matcher used to match the member's value.
   :returns:            Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: instanceOf(clazz)

   The actual value must be an instance of *clazz*::

       assertThat([], instanceOf(Array));

   :arg clazz: Constructor function.
   :returns:   Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: number()

   The actual value must be a number::

       assertThat(10, number());
       assertThat('10', not(number()));

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: object()

   The actual value must be an object::

       assertThat({}, object());
       assertThat(10, not(object()));

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: string()

   The actual value must be an string::

       assertThat('10', string());
       assertThat(10, not(string());

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: typeOf(typeName)

   The actual value must be of the given type::

       assertThat(10, typeOf('number'));
       assertThat({}, typeOf('object'));
       assertThat('10', typeOf('string');
       assertThat(function(){}, typeOf('function'));

   :arg typeName: Name of the type.
   :returns:      Instance of :class:`JsHamcrest.SimpleMatcher`.


Text Matchers
-------------

.. function:: containsString(str)

   The actual string must have a substring equals to *str*::

       assertThat('string', containsString('tri'));

   :param str: Substring.
   :returns:   Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: emailAddress()

   The actual string must look like an e-mail address::

       assertThat('user@domain.com', emailAddress());

   :returns: Instance of :class:`JsHamcrest.SimpleMatcher`.

   .. warning::
      This matcher is not fully compliant with RFC2822 due to its complexity.


.. function:: endsWith(str)

   The actual string must end with *str*::

       assertThat('string', endsWith('ring'));

   :param str: String.
   :returns:   Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: equalIgnoringCase(str)

   The actual string must be equal to *str*, ignoring case::

       assertThat('str', equalIgnoringCase('Str'));

   :param str: String.
   :returns:   Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: matches(regex)

   The actual string must match *regex*::

       assertThat('0xa4f2c', matches(/\b0[xX][0-9a-fA-F]+\b/));

   :arg regex: Regular expression.
   :returns:   Instance of :class:`JsHamcrest.SimpleMatcher`.


.. function:: startsWith(str)

   The actual string must start with *str*::

       assertThat('string', startsWith('str'));

   :param str: String.
   :returns:   Instance of :class:`JsHamcrest.SimpleMatcher`.


.. seealso::
   :ref:`apiref`
