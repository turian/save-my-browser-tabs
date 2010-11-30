@echo off

REM Extension id (be sure to correct it before running the script!):
set save-my-tabs-id="hdoaafjkhcfcoenfgjejgkjibjfdppni"

REM Get the path to the database files.
REM Windows XP or earlier:
set save-my-tabs-path=%userprofile%\Local Settings\Application Data\Google\Chrome\User Data\Default\databases\chrome-extension_%save-my-tabs-id%_0\
REM Windows Vista or later:
REM set save-my-tabs-path=%userprofile%\AppData\Local\Google\Chrome\User Data\Default\databases\chrome-extension_hdoaafjkhcfcoenfgjejgkjibjfdppni_0\

REM Cycle through the files in the db directory:
for /f %%a IN ('dir /b "%save-my-tabs-path%\"') do (

    echo Source path: "%save-my-tabs-path%%%a"

    REM Get db name:
    sqlite3 "%save-my-tabs-path%%%a" "SELECT name FROM save_my_tabs_options" > "%%a.txt"

    set /p name%%a=<"%%a.txt"

    echo Target path: "%name%%%a.txt"
    del "%%a.txt"

    REM Output db rows to a tab-separated file:
    sqlite3 -separator "	" "%save-my-tabs-path%%%a" "SELECT winindex, tabindex, url, title FROM save_my_tabs_records" > "%name%%%a.txt"

    REM Cleanup:
    del "%save-my-tabs-path%%%a"
    set name%%a=
)

REM Reset the variables:
set save-my-tabs-id=
set save-my-tabs-path=