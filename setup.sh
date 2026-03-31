#!/bin/bash

# Infrastructure Automation Platform - Setup Script
# This script sets up the entire project for local development

set -e  # Exit on error

echo "🚀 Setting up Infrastructure Automation Platform..."
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js v$(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm v$(npm --version)"

# Check Terraform
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install from https://www.terraform.io/downloads"
    exit 1
fi
echo "✅ Terraform v$(terraform version -json | grep -o '"version":"[^"]*' | cut -d'"' -f4)"

# Check Git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed."
    exit 1
fi
echo "✅ Git v$(git --version | awk '{print $3}')"

echo ""
echo "📦 Installing dependencies..."

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please update it with your GCP project ID."
fi
cd ..
echo "✅ Backend setup complete"

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd frontend
npm install
cd ..
echo "✅ Frontend setup complete"

# Setup Terraform
echo ""
echo "🏗️ Setting up Terraform..."
cd terraform
terraform init -backend=false
terraform fmt
terraform validate
cd ..
echo "✅ Terraform setup complete"

echo ""
echo "✨ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Update backend/.env with your GCP project ID"
echo ""
echo "2. Start the backend (in terminal 1):"
echo "   cd backend && npm start"
echo ""
echo "3. Start the frontend (in terminal 2):"
echo "   cd frontend && npm start"
echo ""
echo "4. Initialize Terraform (in terminal 3):"
echo "   cd terraform"
echo "   terraform plan -var-file='environments/dev/terraform.tfvars'"
echo ""
echo "📚 For more info, see README.md"
echo ""
