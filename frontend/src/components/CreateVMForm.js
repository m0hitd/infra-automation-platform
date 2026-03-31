import React, { useState } from "react";

function CreateVMForm({ onVMCreated, apiStatus }) {
  const [formData, setFormData] = useState({
    vmName: "",
    machineType: "e2-micro",
    zone: "asia-south1-a",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vmName.trim()) {
      setStatus({ type: "error", message: "VM name is required" });
      return;
    }

    if (apiStatus !== "online") {
      setStatus({
        type: "error",
        message: "API server is offline. Please ensure the backend is running on http://localhost:3000",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("http://localhost:3000/create-vm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vmName: formData.vmName,
          machineType: formData.machineType,
          zone: formData.zone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message,
        });
        setResponse(data);
        onVMCreated(data);
        setFormData({
          vmName: "",
          machineType: "e2-micro",
          zone: "asia-south1-a",
        });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to create VM",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: `Error: ${error.message}. Make sure the backend server is running.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-vm-form">
      <h2>📦 Create Virtual Machine</h2>
      <p className="form-description">
        Fill in the details below to provision a new VM on Google Cloud Platform
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vmName">VM Name *</label>
          <input
            id="vmName"
            type="text"
            name="vmName"
            value={formData.vmName}
            onChange={handleInputChange}
            placeholder="e.g., my-server, web-app-vm"
            disabled={loading}
            required
          />
          <small>Must contain only letters, numbers, and hyphens</small>
        </div>

        <div className="form-group">
          <label htmlFor="machineType">Machine Type</label>
          <select
            id="machineType"
            name="machineType"
            value={formData.machineType}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="e2-micro">e2-micro (0.25-2 vCPU)</option>
            <option value="e2-small">e2-small (0.5-2 vCPU)</option>
            <option value="e2-medium">e2-medium (1-2 vCPU)</option>
            <option value="e2-standard-2">e2-standard-2 (2 vCPU)</option>
            <option value="e2-standard-4">e2-standard-4 (4 vCPU)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="zone">Zone</label>
          <select
            id="zone"
            name="zone"
            value={formData.zone}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="asia-south1-a">asia-south1-a (Delhi)</option>
            <option value="asia-south1-b">asia-south1-b (Delhi)</option>
            <option value="asia-south1-c">asia-south1-c (Delhi)</option>
            <option value="us-central1-a">us-central1-a (Iowa)</option>
            <option value="us-west1-b">us-west1-b (Oregon)</option>
            <option value="europe-west1-b">europe-west1-b (Belgium)</option>
          </select>
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="submit-button"
            disabled={loading || apiStatus !== "online"}
          >
            {loading ? "🔄 Creating..." : "✨ Create VM"}
          </button>
        </div>
      </form>

      {status && (
        <div className={`status-message ${status.type}`}>
          <strong>{status.type === "success" ? "✅ Success" : "❌ Error"}:</strong> {status.message}
        </div>
      )}

      {response && status?.type === "success" && (
        <div className="response-details">
          <h3>📋 Request Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Request ID:</span>
              <span className="detail-value">{response.requestId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">VM Name:</span>
              <span className="detail-value">{response.details.vmName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Machine Type:</span>
              <span className="detail-value">{response.details.machineType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Zone:</span>
              <span className="detail-value">{response.details.zone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estimated Time:</span>
              <span className="detail-value">{response.details.estimatedDeploymentTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateVMForm;
