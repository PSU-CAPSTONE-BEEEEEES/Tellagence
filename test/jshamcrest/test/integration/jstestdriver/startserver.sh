#!/bin/sh

BROWSER_PATH="$1"

if [ -z "$1" ]; then 
	BROWSER_PATH="`which firefox`"
fi

java -jar JsTestDriver-1.2.jar --port 4224 --browser "$BROWSER_PATH"
