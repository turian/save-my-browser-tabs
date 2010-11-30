#!/bin/sh

# Extension id (be sure to correct it before running the script!):
save_my_tabs_id="hdoaafjkhcfcoenfgjejgkjibjfdppni"

# Path to the database files:
save_my_tabs_path="~/.config/google-chrome/Default/databases/chrome-extension_"$save_my_tabs_id"_0/"

# Cycle through the files in the db directory:
for file in `ls $save_my_tabs_path` do

    # Get db name:
	$name=`sqlite3 $file "SELECT name FROM save_my_tabs_options LIMIT 1"`

    # Output db rows to a tab-separated file:
	sqlite3 .separator "	" $file "SELECT winindex, tabindex, url, title FROM save_my_tabs_records" > $name".txt"

    # Delete the original database:
	rm -f $file

done