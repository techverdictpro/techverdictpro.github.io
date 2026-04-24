@echo off
REM TechVerdictPro - Automated Content Generation & GitHub Upload
REM Run this with Task Scheduler at 2 AM daily

echo ================================================
echo TechVerdictPro Automated Content Pipeline
echo Started: %date% %time%
echo ================================================

REM Change to project directory
cd /d C:\TechVerdictPro

REM Step 1: Generate 12 articles (3 batches of 4)
echo.
echo [STEP 1/5] Generating first batch (4 articles)...
call npm run generate
if errorlevel 1 (
    echo ERROR: First batch failed!
    pause
    exit /b 1
)
timeout /t 60 /nobreak

echo.
echo [STEP 2/5] Generating second batch (4 articles)...
call npm run generate
if errorlevel 1 (
    echo ERROR: Second batch failed!
    pause
    exit /b 1
)
timeout /t 60 /nobreak

echo.
echo [STEP 3/5] Generating third batch (4 articles)...
call npm run generate
if errorlevel 1 (
    echo ERROR: Third batch failed!
    pause
    exit /b 1
)

REM Step 2: Update manifest
echo.
echo [STEP 4/5] Updating manifest...
call node update-manifest.js
if errorlevel 1 (
    echo ERROR: Manifest update failed!
    pause
    exit /b 1
)

REM Step 3: Upload to GitHub
echo.
echo [STEP 5/5] Uploading to GitHub...
call powershell -ExecutionPolicy Bypass -File "C:\TechVerdictPro\git-upload.ps1"
if errorlevel 1 (
    echo ERROR: Git upload failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo SUCCESS! All tasks completed!
echo Finished: %date% %time%
echo ================================================
echo.
echo Daily stats will be saved to: C:\TechVerdictPro\logs\
echo.

REM Log completion
echo %date% %time% - Automated run completed successfully >> C:\TechVerdictPro\logs\automation.log

exit /b 0
