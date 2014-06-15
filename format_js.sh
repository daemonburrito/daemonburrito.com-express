#!/usr/bin/env bash
set -e
FILES=$(find . -name "node_modules" -prune -o -name "*.js" -print)

for FILE in $FILES
do
	TMPFILE=`mktemp`
	esformatter $FILE > $TMPFILE
done
