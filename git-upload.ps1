# TechVerdictPro - Automated Git Upload Script
# This script commits and pushes new articles to GitHub

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Git Upload Automation Started" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Set location to repository
Set-Location "C:\TechVerdictPro"

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: Not a git repository!" -ForegroundColor Red
    Write-Host "Run 'git init' first or check path" -ForegroundColor Red
    exit 1
}

# Get current date for commit message
$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HH:mm"

# Count new files
$newFiles = (git status --porcelain | Measure-Object).Count

Write-Host "Found $newFiles changed/new files" -ForegroundColor Yellow
Write-Host ""

if ($newFiles -eq 0) {
    Write-Host "No changes to commit. Exiting." -ForegroundColor Green
    exit 0
}

# Git operations
try {
    Write-Host "[1/4] Staging all changes..." -ForegroundColor Cyan
    git add .
    
    Write-Host "[2/4] Committing changes..." -ForegroundColor Cyan
    $commitMessage = "Auto-update: 12 articles + manifest ($date $time)"
    git commit -m $commitMessage
    
    Write-Host "[3/4] Pulling latest changes..." -ForegroundColor Cyan
    git pull origin main --rebase
    
    Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Cyan
    git push origin main
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "SUCCESS! Uploaded to GitHub" -ForegroundColor Green
    Write-Host "Commit: $commitMessage" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    
    # Log success
    $logMessage = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Upload successful: $newFiles files"
    Add-Content -Path "C:\TechVerdictPro\logs\git-upload.log" -Value $logMessage
    
    exit 0
    
} catch {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "ERROR: Git upload failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    
    # Log error
    $errorMessage = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Upload failed: $_"
    Add-Content -Path "C:\TechVerdictPro\logs\git-upload.log" -Value $errorMessage
    
    exit 1
}
