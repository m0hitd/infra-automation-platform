# Quick Start Guide

This guide will help you get the Infrastructure Automation Platform running in just a few minutes.

## ⚡ 3-Minute Quick Start

### Step 1: Install Prerequisites (if not already installed)

**Windows / Mac / Linux:**
- [Node.js 18+](https://nodejs.org/)
- [Terraform 1.5+](https://www.terraform.io/downloads)
- [Git](https://git-scm.com/)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

### Step 2: Clone & Setup

**Windows (PowerShell):**
```powershell
git clone https://github.com/yourusername/infra-automation-platform.git
cd infra-automation-platform
.\setup.ps1
```

**Mac / Linux:**
```bash
git clone https://github.com/yourusername/infra-automation-platform.git
cd infra-automation-platform
chmod +x setup.sh
./setup.sh
```

### Step 3: Configure Your GCP Project

Edit `backend/.env`:
```bash
# Update these values
GCP_PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

Edit `terraform/environments/dev/terraform.tfvars`:
```hcl
project_id = "your-gcp-project-id"
```

### Step 4: Run the Application

**Terminal 1 - Backend API:**
```bash
cd backend
npm start
# Output: 🚀 API running on http://localhost:3000
```

**Terminal 2 - Frontend Dashboard:**
```bash
cd frontend
npm start
# Opens: http://localhost:3000
```

**Terminal 3 - Terraform (Optional for testing):**
```bash
cd terraform
terraform plan -var-file="environments/dev/terraform.tfvars"
```

### Step 5: Test It Out! 🎉

1. Open http://localhost:3000 in your browser
2. Fill in the VM creation form:
   - VM Name: `test-vm`
   - Machine Type: `e2-micro`
   - Zone: `asia-south1-a`
3. Click "Create VM"
4. Check GCP Console → Compute Engine to see your VM being created

## 🐛 Troubleshooting

### Issue: "API Server Offline"
**Solution:**
```bash
# Make sure backend is running
cd backend
npm start
```

### Issue: Terraform not found
**Solution:**
```bash
# Install Terraform
terraform version
# or download from https://www.terraform.io/downloads
```

### Issue: Permission denied on setup.sh
**Solution:**
```bash
chmod +x setup.sh
./setup.sh
```

### Issue: npm ERR! missing script
**Solution:**
```bash
# Make sure you're in the right directory
cd backend    # for backend
# or
cd frontend   # for frontend
```

## 📱 API Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Create VM
```bash
curl -X POST http://localhost:3000/create-vm \
  -H "Content-Type: application/json" \
  -d '{
    "vmName": "my-server",
    "machineType": "e2-micro",
    "zone": "asia-south1-a"
  }'
```

### Get Requests
```bash
curl http://localhost:3000/requests
```

## 🗂️ Important Files

| File | Purpose |
|------|---------|
| `backend/app.js` | API server code |
| `frontend/src/App.js` | React dashboard |
| `terraform/main.tf` | Infrastructure definition |
| `README.md` | Full documentation |
| `docs/architecture.md` | System design |
| `.env` | Configuration (add your GCP project) |

## 🚀 Next Steps

1. **Deploy to GCP:**
   ```bash
   gcloud run deploy infra-api --source backend
   ```

2. **Configure Remote Terraform State:**
   ```bash
   gsutil mb gs://unique-tf-state-bucket
   # Then configure in terraform/backend.tf
   ```

3. **Add Authentication:**
   - Implement JWT/OAuth2 for API
   - Set up user roles

4. **Set up CI/CD:**
   - GitHub Actions configured in `.github/workflows/`
   - Add GCP secrets for automated deployment

## 📚 Learn More

- [Full README](../README.md)
- [Architecture](../docs/architecture.md)
- [API Docs](../docs/api.md)
- [Security Guide](../docs/security.md)

## ✨ Pro Tips

1. **Use VS Code** with these extensions:
   - Terraform extension
   - REST Client
   - React extensions

2. **Watch Terraform changes:**
   ```bash
   terraform plan -var-file="environments/dev/terraform.tfvars" > plan.txt
   cat plan.txt
   ```

3. **Check API in real-time:**
   ```bash
   # In another terminal
   watch curl http://localhost:3000/logs
   ```

## 🎯 What You've Learned

✅ How to set up a Terraform + React + Node.js stack
✅ How to structure a production-grade infrastructure project
✅ How to manage infrastructure as code
✅ How to build REST APIs for infrastructure provisioning
✅ How to create a responsive web dashboard

## 🤝 Need Help?

- Check [GitHub Issues](../../../issues)
- Review [Full Documentation](../README.md)
- Read [Workflow Guide](workflow.md)

---

**Estimated Setup Time:** 5-10 minutes
**Next Success:** You should see your first VM created in GCP! 🎉
