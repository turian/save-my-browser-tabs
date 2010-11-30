@echo off

REM Get the path to the database files. Be sure to correct the "chrome-extension_hdoaafjkhcfcoenfgjejgkjibjfdppni_0" part!
REM Windows XP or earlier:
set save-my-tabs-path=%userprofile%\Local Settings\Application Data\Google\Chrome\User Data\Default\databases\chrome-extension_hdoaafjkhcfcoenfgjejgkjibjfdppni_0\
REM Windows Vista or later:
REM set save-my-tabs-path=%userprofile%\AppData\Local\Google\Chrome\User Data\Default\databases\chrome-extension_hdoaafjkhcfcoenfgjejgkjibjfdppni_0\

REM Cycle through the files in the db directory:
for /f %%a IN ('dir /b "%save-my-tabs-path%\"') do (

    REM Get db name:
    sqlite3 "%save-my-tabs-path%%%a" "SELECT name FROM save_my_tabs_options LIMIT 1" > "tmp.tmp"

    set name=
    set /p name=< "tmp.tmp"
    del "tmp.tmp"

    REM Output db rows to a tab-separated file:
    sqlite3 -separator "	" "%save-my-tabs-path%%%a" "SELECT winindex, tabindex, url, title FROM save_my_tabs_records" > "%name%.txt"

    REM Delete the original database:
    del "%save-my-tabs-path%%%a"
)

REM Reset the variables:
set save-my-tabs-path=
set name=