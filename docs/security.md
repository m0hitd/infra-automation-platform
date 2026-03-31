# Security Documentation

## Security Design Principles

### 1. Principle of Least Privilege
Every component and user has only the minimum permissions necessary to function.

**Implementation**:
- Service accounts with specific IAM roles
- No wildcard permissions
- Role-based access control (RBAC)
- Regular permission audits

### 2. Defense in Depth
Multiple layers of security controls to prevent unauthorized access.

**Implementation**:
- Network segmentation (VPC)
- API authentication and validation
- Encryption at rest and in transit
- Regular security assessments

### 3. Secure by Design
Security integrated into architecture from the beginning.

**Implementation**:
- No hardcoded credentials
- Secure defaults throughout
- Security in infrastructure code
- Immutable deployments

## Authentication & Authorization

### API Authentication

**Current Implementation**:
- Health check endpoint: Public access (for monitoring)
- Infrastructure endpoints: Should require authentication (production)

**Production Upgrade (Recommended)**:
```javascript
// JWT-based authentication
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify JWT token
  // Attach user info to request
};

app.post("/create-vm", verifyToken, createVMHandler);
```

### Authorization Levels

**Admin Role**:
- Create/destroy any resources
- Access all logs and metrics
- Modify system configuration

**Developer Role**:
- Create resources in dev environment
- View own requests and logs
- Cannot access prod environment

**Viewer Role**:
- Read-only access to logs
- Cannot create or destroy resources

## GCP Security Configuration

### Service Account Setup

**Recommended Approach**:
```bash
# Create dedicated service account
gcloud iam service-accounts create infra-automation \
  --display-name="Infrastructure Automation Platform"

# Grant minimal required permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:infra-automation@YOUR_PROJECT.iam.gserviceaccount.com" \
  --role="roles/compute.instanceAdmin.v1"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:infra-automation@YOUR_PROJECT.iam.gserviceaccount.com" \
  --role="roles/storage.admin"
```

### VPC Security

**Network Configuration**:
```
┌─────────────────────────────────────┐
│        Public Subnet               │
│  • Load Balancer                   │
│  • Cloud Run (Backend API)         │
└────────────┬────────────────────────┘
             │
             │ Internal Network
             │
┌────────────▼────────────────────────┐
│      Private Subnet                 │
│  • Cloud SQL Database               │
│  • VMs with private IPs             │
│  • No direct internet access        │
└─────────────────────────────────────┘
```

### Firewall Rules

**Ingress Rules**:
```
- Allow HTTP/HTTPS from everywhere (0.0.0.0/0)
- Allow SSH from admin IPs only
- Deny all other traffic
```

**Egress Rules**:
```
- Allow to GCP services (Cloud Storage, Cloud SQL)
- Allow to external internet (package downloads)
- Deny dangerous ports (2375, etc.)
```

## Credential Management

### Do's ✅
- Use service account keys for applications
- Rotate credentials regularly
- Store secrets in secure vaults
- Use environment variables for secrets
- Enable audit logging

### Don'ts ❌
- Never commit credentials to Git
- Never hardcode API keys
- Never share service account keys
- Never use personal accounts for automation
- Never log sensitive information

### Implementation

**Environment Variables** (for local development):
```bash
export GCP_PROJECT_ID="your-project"
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

**.gitignore** (protect credentials):
```
# GCP
service-account-key.json
.env
.env.local

# Terraform
*.tfstate
*.tfstate.*
.terraform/
override.tf

# Node
node_modules/
.npm
```

## API Security

### Input Validation

**Name Validation**:
```javascript
// Only allow alphanumeric and hyphens
const isValidVMName = (name) => {
  return /^[a-z0-9-]{1,63}$/.test(name);
};
```

**Machine Type Validation**:
```javascript
const validMachineTypes = [
  'e2-micro', 'e2-small', 'e2-medium',
  'e2-standard-2', 'e2-standard-4'
];

const isValidMachineType = (type) => {
  return validMachineTypes.includes(type);
};
```

### Rate Limiting

**Recommended Middleware**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use(limiter);
```

### HTTPS/TLS

**Requirement**: All communication must use HTTPS in production

**Implementation on Cloud Run**:
- Automatic HTTPS with managed certificates
- TLS 1.2 minimum
- Strong cipher suites

## Terraform Security

### State File Protection

**Local Development**:
```bash
# Add to .gitignore
terraform.tfstate
terraform.tfstate.*
```

**Production - GCS Backend**:
```hcl
terraform {
  backend "gcs" {
    bucket  = "my-tf-state-bucket"
    prefix  = "terraform/state"
  }
}
```

**Bucket Configuration**:
```bash
# Enable versioning
gsutil versioning set on gs://my-tf-state-bucket

# Enable encryption
gsutil encryption set gs://my-tf-state-bucket

# Block public access
gsutil iam ch -d allUsers gs://my-tf-state-bucket
```

### Variable Sensitivity

**Marking Sensitive Values**:
```hcl
variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true  # Won't be shown in logs
}
```

### Resource Access Control

**IAM Roles in Terraform**:
```hcl
resource "google_service_account_iam_member" "terraform_sa" {
  service_account_id = google_service_account.sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:terraform@my-project.iam.gserviceaccount.com"
}
```

## Audit & Logging

### API Logging

**Request Logging**:
```javascript
app.use((req, res, next) => {
  const log = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    // Don't log sensitive data
    userAgent: req.get('user-agent')
  };
  
  console.log(JSON.stringify(log));
  next();
});
```

### GCP Cloud Logging

**View Terraform Logs**:
```bash
gcloud logging read "resource.type=function AND \
  resource.labels.function_name=terraform-executor" \
  --limit 50
```

### Audit Trail

**What to Log**:
- Infrastructure creation/deletion
- User actions and timestamps
- API endpoint access
- Authentication attempts
- Permission changes
- Cost anomalies

## Compliance & Standards

### Security Standards
- **OWASP Top 10**: Follow best practices for web application security
- **CIS Google Cloud Platform Foundation Benchmark**: Align with Google's recommendations
- **NIST Cybersecurity Framework**: Implement industry-standard controls

### Data Protection
- **GDPR Compliance**: If handling EU user data
- **Data Encryption**: Encrypt data at rest and in transit
- **Data Retention**: Define and enforce retention policies

## Incident Response

### Security Incident Procedure

1. **Detection**: Monitor logs for anomalies
2. **Containment**: Disable compromised credentials
3. **Investigation**: Review logs and determine impact
4. **Recovery**: Restore from clean backup
5. **Post-Mortem**: Document lessons learned

### Emergency Credentials Rotation

```bash
# If credentials are compromised
gcloud iam service-accounts keys list \
  --iam-account=infra-automation@YOUR_PROJECT.iam.gserviceaccount.com

gcloud iam service-accounts keys delete <KEY_ID> \
  --iam-account=infra-automation@YOUR_PROJECT.iam.gserviceaccount.com

# Create new key
gcloud iam service-accounts keys create new-key.json \
  --iam-account=infra-automation@YOUR_PROJECT.iam.gserviceaccount.com
```

## Security Checklist for Production

- [ ] Enable MFA on Google Cloud Console
- [ ] Create dedicated service account
- [ ] Configure VPC and firewall rules
- [ ] Enable Cloud Logging
- [ ] Set up alerts for suspicious activity
- [ ] Implement API authentication (OAuth2/JWT)
- [ ] Enable Terraform state locking
- [ ] Configure encrypted backend bucket
- [ ] Regular security audits scheduled
- [ ] Incident response plan documented
- [ ] Backup and recovery tested
- [ ] Employee access control configured
- [ ] Secrets management system in place
- [ ] API rate limiting enabled
- [ ] HTTPS/TLS enforced everywhere

## Resources

- [Google Cloud Security Best Practices](https://cloud.google.com/docs/enterprise/best-practices-for-running-cost-effective-kubernetes-applications-on-gke)
- [Terraform Security Best Practices](https://www.terraform.io/docs/cloud/security/index.html)
- [OWASP Security Guidelines](https://owasp.org/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
