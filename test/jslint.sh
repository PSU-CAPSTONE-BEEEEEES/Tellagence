#!/bin/sh
#
# Tests Javascript files for "lint" such as syntactical errors.

ret=0

for file in `find ../site/js/ -not -path '*lib*' -name '*.js'`;
do
    output=`js -f jslint.js < $file`
    name=`basename $file`

    if [ "$output" == "jslint: No problems found." ];
    then
	echo "$name - no errors found"
	echo ""
	echo "#######################"
	echo ""
    else
	echo "$name - found errors:"
	echo "$output"
	echo ""
	echo "#######################"
	echo ""
	ret=1;
    fi
done;

exit $ret;
