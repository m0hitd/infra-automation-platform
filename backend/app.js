const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { runTerraform, destroyInfra, getTerraformPlan } = require("./services/terraformRunner");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request tracking
const requestLogs = [];

// GET /health - Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Infrastructure Automation Platform API is running",
    timestamp: new Date().toISOString(),
  });
});

// GET /requests - List all infrastructure requests
app.get("/requests", (req, res) => {
  res.status(200).json({
    total_requests: requestLogs.length,
    requests: requestLogs,
  });
});

// POST /create-vm - Create a virtual machine
app.post("/create-vm", async (req, res) => {
  const { vmName, machineType = "e2-micro", zone = "asia-south1-a" } = req.body;

  // Validation
  if (!vmName) {
    return res.status(400).json({
      status: "error",
      message: "VM name is required",
    });
  }

  const requestId = `req-${Date.now()}`;
  const logEntry = {
    timestamp: new Date().toISOString(),
    requestId,
    type: "create-vm",
    vmName,
    machineType,
    zone,
    status: "pending",
  };

  requestLogs.push(logEntry);

  try {
    // Simulate Terraform execution (in production, this would be real)
    const result = await simulateTerraformExecution(vmName);

    logEntry.status = "success";
    logEntry.output = result;

    res.status(201).json({
      status: "success",
      message: `Infrastructure provisioning initiated for VM: ${vmName}`,
      requestId,
      details: {
        vmName,
        machineType,
        zone,
        estimatedDeploymentTime: "2-3 minutes",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logEntry.status = "failed";
    logEntry.error = error.message;

    res.status(500).json({
      status: "error",
      message: "Failed to create infrastructure",
      requestId,
      error: error.message,
    });
  }
});

// POST /create-storage - Create a cloud storage bucket
app.post("/create-storage", (req, res) => {
  const { bucketName } = req.body;

  if (!bucketName) {
    return res.status(400).json({
      status: "error",
      message: "Bucket name is required",
    });
  }

  const requestId = `req-${Date.now()}`;
  requestLogs.push({
    timestamp: new Date().toISOString(),
    requestId,
    type: "create-storage",
    bucketName,
    status: "success",
  });

  res.status(201).json({
    status: "success",
    message: `Storage bucket "${bucketName}" creation initiated`,
    requestId,
    details: {
      bucketName,
      region: "asia-south1",
      storageClass: "STANDARD",
    },
    timestamp: new Date().toISOString(),
  });
});

// POST /destroy-infrastructure - Destroy provisioned infrastructure
app.post("/destroy-infrastructure", (req, res) => {
  const { vmName } = req.body;

  if (!vmName) {
    return res.status(400).json({
      status: "error",
      message: "VM name is required for destruction",
    });
  }

  const requestId = `req-${Date.now()}`;
  requestLogs.push({
    timestamp: new Date().toISOString(),
    requestId,
    type: "destroy",
    vmName,
    status: "success",
  });

  res.status(200).json({
    status: "success",
    message: `Infrastructure destruction initiated for: ${vmName}`,
    requestId,
    warning: "Resources will be deleted. This action cannot be undone.",
    timestamp: new Date().toISOString(),
  });
});

// GET /logs - View system logs
app.get("/logs", (req, res) => {
  res.status(200).json({
    timestamp: new Date().toISOString(),
    totalLogs: requestLogs.length,
    logs: requestLogs.slice(-20), // Last 20 logs
  });
});

// Simulate Terraform execution
function simulateTerraformExecution(vmName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        resource: "google_compute_instance",
        name: vmName,
        state: "provisioning",
        ipAddress: `10.128.0.${Math.floor(Math.random() * 255)}`,
      });
    }, 1000);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    path: req.path,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Infrastructure Automation API running on http://localhost:${PORT}`);
  console.log(`📚 Endpoints: GET /health, POST /create-vm, POST /create-storage, POST /destroy-infrastructure`);
});

module.exports = app;
