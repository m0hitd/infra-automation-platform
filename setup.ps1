# Infrastructure Automation Platform - Setup Script (PowerShell)
# Run this script with: .\setup.ps1

Write-Host "🚀 Setting up Infrastructure Automation Platform..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

# Check Terraform
try {
    $terraformVersion = terraform version -json | ConvertFrom-Json
    Write-Host "✅ Terraform v$($terraformVersion.terraform_version)" -ForegroundColor Green
} catch {
    Write-Host "❌ Terraform is not installed. Please install from https://www.terraform.io/downloads" -ForegroundColor Red
    exit 1
}

# Check Git
try {
    $gitVersion = git --version
    Write-Host "✅ $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Setup Backend
Write-Host ""
Write-Host "🔧 Setting up Backend..." -ForegroundColor Cyan
Push-Location .\backend
npm install
if (-Not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "⚠️  Created .env file. Please update it with your GCP project ID." -ForegroundColor Yellow
}
Pop-Location
Write-Host "✅ Backend setup complete" -ForegroundColor Green

# Setup Frontend
Write-Host ""
Write-Host "🎨 Setting up Frontend..." -ForegroundColor Cyan
Push-Location .\frontend
npm install
Pop-Location
Write-Host "✅ Frontend setup complete" -ForegroundColor Green

# Setup Terraform
Write-Host ""
Write-Host "🏗️ Setting up Terraform..." -ForegroundColor Cyan
Push-Location .\terraform
terraform init -backend=false
terraform fmt
terraform validate
Pop-Location
Write-Host "✅ Terraform setup complete" -ForegroundColor Green

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Update backend\.env with your GCP project ID" -ForegroundColor White
Write-Host ""
Write-Host "2. Start the backend (in terminal 1):" -ForegroundColor White
Write-Host "   cd backend; npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the frontend (in terminal 2):" -ForegroundColor White
Write-Host "   cd frontend; npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Initialize Terraform (in terminal 3):" -ForegroundColor White
Write-Host "   cd terraform" -ForegroundColor Gray
Write-Host "   terraform plan -var-file='environments\dev\terraform.tfvars'" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 For more info, see README.md" -ForegroundColor White
Write-Host ""
