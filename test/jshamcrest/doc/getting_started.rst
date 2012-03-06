Getting Started
===============

The first thing to do is download the JsHamcrest source file. You can find the
download links at the :ref:`index <doc_index>` page.


Setting Up The First Example
----------------------------

To be able to use JsHamcrest inside the browser, all you have to do is link the
source file from within your HTML file. For example, create a new file with the
following content and open it on your web browser of choice:

.. code-block:: html

    <html>
    <header>
        <title>Page title</title>
        <script type="text/javascript" src="path/to/jshamcrest.js"></script>

        <script type="text/javascript">
            var odd = JsHamcrest.Matchers.odd();
            alert(odd.matches(11)); // Expected: true
        </script>
    </header>
    <body>
    </body>
    </html>


If an alert message "true" pops up when you open the page, then
congratulations!

.. note::
   Don't forget to change the 4th line to make it point to your actual
   JsHamcrest source file. 


JsHamcrest Outside The Web Browser
----------------------------------

Since JsHamcrest doesn't depend on any browser-specific JavaScript features
(like :attr:`document`, :attr:`window`, and so on), you should be able to use
it with any modern stand-alone JavaScript interpreter.

The snippet below shows how to reproduce the previous example using `Rhino`_,
a `Java`_-based JavaScript interpreter/compiler developed by `Mozilla`_::

    js> load('path/to/jshamcrest.js')
    js> var odd = JsHamcrest.Matchers.odd()
    js> odd.matches(11)
    true
    js> odd.matches(10)
    false


Understanding The Code
``````````````````````

On the previous example, you saw the :meth:`JsHamcrest.Matchers.odd` function,
which returns a *matcher object* that checks whether the given number is odd.
In other words, a *matcher* is an object that determines whether two things are
equivalent.

Now try to figure out what the following matchers do::

    // Make JsHamcrest matchers globally accessible
    JsHamcrest.Integration.copyMembers(this);

    equalTo('10').matches(10);       // Expected: true
    between(5).and(10).matches(7);   // Expected: true
    greaterThan(Math.PI).matches(4); // Expected: true


To make things easier, try to read each statement backwards. For instance:

* ...is 10 **equal to** '10'?
* ...is 7 **between** 5 **and** 10?
* ...is 4 **greater than** Math.PI?


It's not that hard after all, huh?

.. seealso::
   :mod:`JsHamcrest.Matchers` namespace for the complete list of matchers.


.. _Rhino: http://www.mozilla.org/rhino/
.. _Java: http://java.sun.com/
.. _Mozilla: http://www.mozilla.org/
