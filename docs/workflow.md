# Workflow Documentation

## User Interaction Workflow

### Step 1: User Accesses Dashboard
```
User Browser
    ↓
React Frontend (http://localhost:3000)
    ↓
Checks API Health (GET /health)
    ↓
Displays UI Status
```

### Step 2: User Creates Virtual Machine
```
┌─────────────────────────────────────────┐
│   User Fills Form:                      │
│   - VM Name (required)                  │
│   - Machine Type (optional)             │
│   - Zone (optional)                     │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   Frontend Validation:                  │
│   - Check required fields               │
│   - Verify API is online                │
│   - Show loading indicator              │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   HTTP POST Request:                    │
│   POST /create-vm                       │
│   {                                     │
│     "vmName": "my-server",              │
│     "machineType": "e2-micro",          │
│     "zone": "asia-south1-a"             │
│   }                                     │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   Backend Processing:                   │
│   - Validate input parameters           │
│   - Generate request ID                 │
│   - Log request                         │
│   - Execute Terraform                   │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   Terraform Execution:                  │
│   - Load configuration                  │
│   - Validate resources                  │
│   - Apply configuration                 │
│   - Create infrastructure                │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   GCP Resource Creation:                │
│   - Allocate VM resources               │
│   - Configure networking                │
│   - Set security groups                 │
│   - Start instance                      │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   Response to Frontend:                 │
│   HTTP 201 Created                      │
│   {                                     │
│     "status": "success",                │
│     "requestId": "req-123456",          │
│     "message": "VM created",            │
│     "details": {...}                    │
│   }                                     │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   Frontend Updates:                     │
│   - Hide loading indicator              │
│   - Show success message                │
│   - Display request details             │
│   - Update request list                 │
└─────────────────────────────────────────┘
```

## API Request/Response Cycle

### Create VM Request
**Endpoint**: `POST /create-vm`

**Request Body**:
```json
{
  "vmName": "web-server-01",
  "machineType": "e2-medium",
  "zone": "asia-south1-a"
}
```

**Response (Success - 201)**:
```json
{
  "status": "success",
  "message": "Infrastructure provisioning initiated for VM: web-server-01",
  "requestId": "req-1709876543210",
  "details": {
    "vmName": "web-server-01",
    "machineType": "e2-medium",
    "zone": "asia-south1-a",
    "estimatedDeploymentTime": "2-3 minutes"
  },
  "timestamp": "2024-03-08T10:30:45.123Z"
}
```

**Response (Error - 400)**:
```json
{
  "status": "error",
  "message": "VM name is required",
  "timestamp": "2024-03-08T10:30:45.123Z"
}
```

### Get Health Status
**Endpoint**: `GET /health`

**Response (200)**:
```json
{
  "status": "OK",
  "message": "Infrastructure Automation Platform API is running",
  "timestamp": "2024-03-08T10:30:45.123Z"
}
```

### Get Requests
**Endpoint**: `GET /requests`

**Response (200)**:
```json
{
  "total_requests": 3,
  "requests": [
    {
      "timestamp": "2024-03-08T10:30:45.123Z",
      "requestId": "req-1709876543210",
      "type": "create-vm",
      "vmName": "web-server-01",
      "machineType": "e2-medium",
      "zone": "asia-south1-a",
      "status": "success"
    },
    ...
  ]
}
```

## Terraform Workflow

### Initialization
```bash
cd terraform
terraform init
```
- Downloads required providers
- Initializes backend configuration
- Creates `.terraform` directory

### Planning
```bash
terraform plan -var-file="environments/dev/terraform.tfvars"
```
- Analyzes current state
- Calculates required changes
- Shows plan without applying

Example output:
```
Terraform will perform the following actions:

  # google_compute_instance.vm_instance will be created
  + resource "google_compute_instance" "vm_instance" {
      + id           = (known after apply)
      + machine_type = "e2-micro"
      + name         = "web-server-01"
      + zone         = "asia-south1-a"
      ...
    }

Plan: 1 to add, 0 to change, 0 to destroy.
```

### Applying
```bash
terraform apply -auto-approve \
  -var="instance_name=web-server-01"
```
- Executes planned changes
- Creates/updates resources
- Updates state file

### Destroying
```bash
terraform destroy -auto-approve
```
- Identifies all resources
- Removes them from GCP
- Updates state file

## Data Persistence

### Frontend State
- Stored in React component state
- Lost on page refresh
- Can be persisted to localStorage

### Backend Logs
- Stored in memory (can be extended to DB)
- Contains all requests and responses
- Useful for audit trail

### Terraform State
```
terraform.tfstate
├── version
├── serial
├── resources
│   └── google_compute_instance
│       ├── id
│       ├── name
│       ├── network_interface
│       └── ...
└── outputs
```

## Error Handling Flow

```
┌─────────────────────────────┐
│  Request Received           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Input Validation           │
│  • Check required fields    │
│  • Verify format            │
└────────┬────────────────────┘
         │
    ✓    │    ✗
    │    │    │
    │    └────┴────────────────┐
    │                          │
    ▼                          ▼
┌─────────────────┐   ┌──────────────────┐
│ Execute Logic   │   │ Return Error 400 │
└────────┬────────┘   └──────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Terraform Execution        │
│  • Run custom script         │
│  • Check exit code           │
└────────┬────────────────────┘
         │
    ✓    │    ✗
    │    │    │
    │    └────┴────────────────┐
    │                          │
    ▼                          ▼
┌─────────────────┐   ┌──────────────────┐
│ Return Success  │   │ Return Error 500 │
│ 201 Created     │   │ With Error Msg   │
└─────────────────┘   └──────────────────┘
```

## Lifecycle of Infrastructure Resource

### 1. Creation Phase
```
Request → Validation → Terraform Init → Terraform Plan → Terraform Apply
```
**Status**: `Provisioning`
**Duration**: 2-3 minutes

### 2. Running Phase
```
Resource Active → Monitoring → Health Checks
```
**Status**: `Active`
**Duration**: Until destroyed

### 3. Destruction Phase
```
Destroy Request → Terraform Plan → Terraform Destroy → Cleanup
```
**Status**: `Destroying` → `Destroyed`
**Duration**: 30-60 seconds

## Security Checkpoints

1. **Input Validation Checkpoint**
   - Verify VM name format
   - Check machine type availability
   - Validate zone existence

2. **API Endpoint Checkpoint**
   - Verify request origin
   - Check authentication (if enabled)
   - Rate limit enforcement

3. **Infrastructure Checkpoint**
   - IAM permission verification
   - Security group validation
   - Encryption configuration

4. **Audit Checkpoint**
   - Log all operations
   - Track resource ownership
   - Monitor cost changes
