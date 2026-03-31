# Architecture Overview

## System Architecture

The Infrastructure Automation Platform is designed with a modular, scalable architecture that separates concerns into distinct layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Layer (Frontend)                      │
│              React.js Dashboard | Web Browser                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTP (REST API)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   API Layer (Backend)                            │
│        Node.js Express | Cloud Run / Docker                      │
│  - Request Processing                                           │
│  - Validation                                                   │
│  - Terraform Orchestration                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    File System / CLI
                             │
┌────────────────────────────▼────────────────────────────────────┐
│              Infrastructure as Code Layer (IaC)                  │
│                   Terraform Configuration                        │
│  - Modular structure (compute, network, storage)                │
│  - Variable management                                          │
│  - Output definitions                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    GCP API / Cloud SDK
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   Cloud Provider Layer                           │
│              Google Cloud Platform (GCP)                         │
│  - Compute Engine (VMs)                                         │
│  - Cloud Storage (Buckets)                                      │
│  - Networking (VPC, Firewall)                                   │
│  - IAM & Security                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer
- **Technology**: React.js
- **Responsibility**: User Interface and Interaction
- **Features**:
  - VM creation form with configuration options
  - Real-time API status monitoring
  - Request history tracking
  - Dashboard statistics

### 2. Backend API Layer
- **Technology**: Node.js with Express
- **Deployment**: Google Cloud Run (serverless)
- **Responsibility**:
  - Process infrastructure requests
  - Validate user input
  - Execute Terraform commands
  - Manage request lifecycle
  - Monitor infrastructure health

**Key Endpoints**:
- `GET /health` - API health check
- `POST /create-vm` - Provision virtual machine
- `POST /create-storage` - Provision storage bucket
- `POST /destroy-infrastructure` - Tear down resources
- `GET /requests` - List all requests
- `GET /logs` - View system logs

### 3. Infrastructure as Code Layer
- **Technology**: Terraform (HashiCorp)
- **Structure**:
  ```
  terraform/
  ├── modules/
  │   ├── compute/      # VM provisioning logic
  │   ├── network/      # VPC & networking
  │   └── storage/      # Cloud Storage buckets
  ├── environments/
  │   ├── dev/          # Development configs
  │   └── prod/         # Production configs
  └── backend.tf        # State management
  ```

### 4. Cloud Provider Layer
- **Provider**: Google Cloud Platform (GCP)
- **Services**:
  - **Compute Engine**: Virtual machine instances
  - **Cloud Storage**: Data storage and backups
  - **Cloud Run**: Serverless backend hosting
  - **Cloud SQL**: Managed database (optional)
  - **IAM**: Identity and Access Management

## Data Flow

1. **User Request**: User fills form in React UI
2. **API Call**: Frontend sends HTTP POST to backend
3. **Validation**: Backend validates input parameters
4. **Terraform Execution**: Backend runs `terraform apply`
5. **Resource Creation**: Terraform provisions resources on GCP
6. **State Management**: Terraform updates state file
7. **Response**: Backend returns status to frontend
8. **UI Update**: Frontend displays result and updates logs

## State Management

### Local Development
- State stored locally in `terraform.tfstate`
- Suitable for single-user development

### Production Deployment
```hcl
terraform {
  backend "gcs" {
    bucket  = "your-tf-state-bucket"
    prefix  = "terraform/state"
  }
}
```
- State stored in Google Cloud Storage
- Enables team collaboration
- Provides locking mechanism

## Security Architecture

### Network Security
- Private subnet configuration for databases
- VPC endpoints for service isolation
- Firewall rules with least privilege access

### Identity & Access Management
- Service accounts with minimal permissions
- IAM roles following principle of least privilege
- No hardcoded credentials in code

### Data Security
- Encrypted state files in GCS
- HTTPS for all API communications
- Sensitive data handled via environment variables

## Scalability Considerations

1. **Horizontal Scaling**: Cloud Run auto-scales based on traffic
2. **Concurrent Requests**: Terraform locking prevents conflicts
3. **Multi-Environment**: Separate dev/prod configurations
4. **Modular Design**: Easy to add new resource types

## Disaster Recovery

- Remote state backup in GCS
- Versioning enabled on state bucket
- Point-in-time recovery capabilities
- Regular state snapshots

## Cost Optimization

- Ephemeral resources cleaned up automatically
- Right-sizing of VM types based on workload
- Cost monitoring via Cloud Billing
- Reserved instances for production
