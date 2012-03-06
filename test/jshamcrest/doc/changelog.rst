Changelog
=========

Like any other piece of software, JsHamcrest is evolving at each release.
Here you can track our progress:

**Version 0.6.7** *(Sep 11, 2011)*

* Updated :meth:`JsHamcrest.Matchers.hasSize` function to make it work with
  objects;


**Version 0.6.6** *(Jun 23, 2011)*

* Fixed broken logic of :meth:`JsHamcrest.areArraysEqual` function;


**Version 0.6.5** *(Jun 20, 2011)*

* Description of the Function literal now includes function name when
  available;


**Version 0.6.4** *(May 25, 2011)*

* Updated ``hasMember`` matcher to make it possible to also match considering
  the member's value;


**Version 0.6.3** *(Apr 23, 2011)*

* Integration with Jasmine;


**Version 0.6.2** *(Sep 30, 2010)*

* Added :meth:`JsHamcrest.Operators.callTo()` function, which makes
  :meth:`JsHamcrest.Matchers.raises()` and 
  :meth:`JsHamcrest.Matchers.raisesAnything()` easier to use.


**Version 0.6.1** *(Dec 22, 2009)*

* Fixed the code that removes useless stacktrace entries when using JsHamcrest
  with js-test-driver;


**Version 0.6** *(Nov 22, 2009)*

* Build script rewritten from scratch with `Python <http://python.org/>`_;
* Documentation rewritten from scratch with `Sphinx <http://sphinx.pocoo.org/>`_;
* Added a couple of new matchers;
* New :mod:`JsHamcrest.Operators` namespace;
* Several improvements and fixes;


**Version 0.5.2** *(Jul 19, 2009)*

* JSLint fixes;
* Integration with screw-unit (thanks, Chris Leishman!)


**Version 0.5.1** *(Jul 11, 2009)*

* Added a new function to :class:`JsHamcrest.SimpleMatcher` that provides a
  better way to describe the actual value;
* Added a couple of new matchers;
* Improvements on test code;


**Version 0.4** *(May 26, 2009)*

* Integration with JsTestDriver and JsUnity;
* Some code cleanup;


**Version 0.3** *(May 23, 2009)*

* Integration with QUnit;
* Improvements on integration code;
* Added some integration tests;
* Documentation improvements;


**Version 0.2** *(May 22, 2009)*

* Fixed small API documentation issues;
* Download page link in README;
* :meth:`JsHamcrest.Operators.assert()` function now accepts a string that
  describes the assertion;
* Refactoring to allow easy integration with JavaScript testing frameworks;


**Version 0.1** *(April 21, 2009)*

* First public release;
