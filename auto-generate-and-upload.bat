@echo off
setlocal enabledelayedexpansion

REM ================================================
REM TechVerdictPro Automated Content Pipeline
REM ================================================

echo.
echo ================================================
echo TechVerdictPro Automated Content Pipeline
echo Started: %date% %time%
echo ================================================
echo.

REM Set working directory
cd /d C:\TechVerdictPro

REM Create timestamp for logging
set timestamp=%date:~-4%-%date:~3,2%-%date:~0,2% %time:~0,8%

REM ================================================
REM STEP 1: Generate First Batch (4 articles)
REM ================================================
echo [STEP 1/6] Generating first batch (4 articles)...
echo.
call npm run generate
if errorlevel 1 (
    echo ERROR: First batch generation failed!
    echo %timestamp% - ERROR: First batch generation failed >> logs\automation.log
    goto :error
)
echo.
echo First batch complete!
echo.

REM Wait 60 seconds to avoid API rate limits
echo Waiting 60 seconds before next batch...
timeout /t 60 /nobreak > nul

REM ================================================
REM STEP 2: Generate Second Batch (4 articles)
REM ================================================
echo.
echo [STEP 2/6] Generating second batch (4 articles)...
echo.
call npm run generate
if errorlevel 1 (
    echo ERROR: Second batch generation failed!
    echo %timestamp% - ERROR: Second batch generation failed >> logs\automation.log
    goto :error
)
echo.
echo Second batch complete!
echo.

REM Wait 60 seconds
echo Waiting 60 seconds before next batch...
timeout /t 60 /nobreak > nul

REM ================================================
REM STEP 3: Generate Third Batch (4 articles)
REM ================================================
echo.
echo [STEP 3/6] Generating third batch (4 articles)...
echo.
call npm run generate
if errorlevel 1 (
    echo ERROR: Third batch generation failed!
    echo %timestamp% - ERROR: Third batch generation failed >> logs\automation.log
    goto :error
)
echo.
echo Third batch complete!
echo.

REM ================================================
REM STEP 4: Copy files to articles folder
REM ================================================
echo.
echo [STEP 4/6] Copying generated files to articles folder...
echo.

REM Copy all HTML files from generated-content to articles
xcopy generated-content\*.html articles\ /Y /I > nul
if errorlevel 1 (
    echo ERROR: File copy failed!
    echo %timestamp% - ERROR: File copy failed >> logs\automation.log
    goto :error
)

echo Files copied successfully!
echo.

REM ================================================
REM STEP 5: Update Manifest
REM ================================================
echo.
echo [STEP 5/6] Updating manifest...
echo.
call node update-manifest.js
if errorlevel 1 (
    echo ERROR: Manifest update failed!
    echo %timestamp% - ERROR: Manifest update failed >> logs\automation.log
    goto :error
)
echo.
echo Manifest updated!
echo.

REM ================================================
REM STEP 6: Upload to GitHub
REM ================================================
echo.
echo [STEP 6/6] Uploading to GitHub...
echo.
call powershell -ExecutionPolicy Bypass -File git-upload.ps1
if errorlevel 1 (
    echo ERROR: GitHub upload failed!
    echo %timestamp% - ERROR: GitHub upload failed >> logs\automation.log
    goto :error
)
echo.
echo GitHub upload complete!
echo.

REM ================================================
REM SUCCESS
REM ================================================
echo.
echo ================================================
echo SUCCESS! All tasks completed!
echo Completed: %date% %time%
echo ================================================
echo.

REM Log success
echo %timestamp% - Automated run completed successfully >> logs\automation.log

REM Wait 5 seconds before closing
timeout /t 5 /nobreak > nul
exit /b 0

REM ================================================
REM ERROR HANDLER
REM ================================================
:error
echo.
echo ================================================
echo ERROR: Automation failed!
echo Check logs\automation.log for details
echo ================================================
echo.
timeout /t 10 /nobreak > nul
exit /b 1
