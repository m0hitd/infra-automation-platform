import React, { useState } from "react";

function CreateVMForm({ onVMCreated, apiStatus }) {
  const [formData, setFormData] = useState({
    vmName: "",
    machineType: "e2-micro",
    zone: "asia-south1-a",
    image: "debian-11",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState(null);
  const [errors, setErrors] = useState({});

  const machineTypes = [
    { value: "e2-micro", label: "e2-micro (0.5-2 vCPU, 1GB RAM)" },
    { value: "e2-small", label: "e2-small (0.5-2 vCPU, 2GB RAM)" },
    { value: "e2-medium", label: "e2-medium (1-2 vCPU, 4GB RAM)" },
    { value: "n1-standard-1", label: "n1-standard-1 (1 vCPU, 3.75GB RAM)" },
    { value: "n1-standard-4", label: "n1-standard-4 (4 vCPU, 15GB RAM)" },
  ];

  const zones = [
    { value: "asia-south1-a", label: "asia-south1-a (Delhi)" },
    { value: "us-central1-a", label: "us-central1-a (Iowa)" },
    { value: "europe-west1-b", label: "europe-west1-b (Belgium)" },
    { value: "asia-east1-a", label: "asia-east1-a (Taiwan)" },
  ];

  const images = [
    { value: "debian-11", label: "Debian 11" },
    { value: "ubuntu-2204", label: "Ubuntu 22.04 LTS" },
    { value: "ubuntu-2004", label: "Ubuntu 20.04 LTS" },
    { value: "centos-8", label: "CentOS 8" },
    { value: "windows-2019", label: "Windows Server 2019" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vmName.trim()) {
      newErrors.vmName = "VM name is required";
    } else if (!/^[a-z0-9-]{1,63}$/.test(formData.vmName)) {
      newErrors.vmName = "VM name must contain only lowercase letters, numbers, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
          image: formData.image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "VM created successfully! Check your GCP console to verify.",
        });
        setResponse(data);
        onVMCreated(data);
        setFormData({
          vmName: "",
          machineType: "e2-micro",
          zone: "asia-south1-a",
          image: "debian-11",
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
      <h2>Create Virtual Machine</h2>
      <p className="form-description">
        Configure and provision a new virtual machine on Google Cloud Platform
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vmName">
            VM Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="vmName"
            name="vmName"
            value={formData.vmName}
            onChange={handleInputChange}
            placeholder="e.g., my-app-server"
            className={errors.vmName ? "error" : ""}
          />
          {errors.vmName && <small className="error-text">{errors.vmName}</small>}
          <small>Lowercase letters, numbers, and hyphens only</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="machineType">
              Machine Type <span className="required">*</span>
            </label>
            <select
              id="machineType"
              name="machineType"
              value={formData.machineType}
              onChange={handleInputChange}
            >
              {machineTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <small>Choose based on your workload requirements</small>
          </div>

          <div className="form-group">
            <label htmlFor="zone">
              Zone <span className="required">*</span>
            </label>
            <select
              id="zone"
              name="zone"
              value={formData.zone}
              onChange={handleInputChange}
            >
              {zones.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </select>
            <small>Select the geographic region for your VM</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">
            Operating System <span className="required">*</span>
          </label>
          <select
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          >
            {images.map((img) => (
              <option key={img.value} value={img.value}>
                {img.label}
              </option>
            ))}
          </select>
          <small>Choose the OS image for your VM</small>
        </div>

        <div className="form-preview">
          <h4>Configuration Summary</h4>
          <div className="preview-item">
            <span className="preview-label">VM Name:</span>
            <span className="preview-value">{formData.vmName || "Not set"}</span>
          </div>
          <div className="preview-item">
            <span className="preview-label">Machine Type:</span>
            <span className="preview-value">{machineTypes.find(t => t.value === formData.machineType)?.label}</span>
          </div>
          <div className="preview-item">
            <span className="preview-label">Zone:</span>
            <span className="preview-value">{zones.find(z => z.value === formData.zone)?.label}</span>
          </div>
          <div className="preview-item">
            <span className="preview-label">OS Image:</span>
            <span className="preview-value">{images.find(i => i.value === formData.image)?.label}</span>
          </div>
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="submit-button"
            disabled={loading || apiStatus !== "online"}
          >
            {loading ? "Creating VM..." : "Create VM"}
          </button>
        </div>

        {status && (
          <div className={`status-message ${status.type}`}>
            {status.type === "success" && "✓ "}
            {status.type === "error" && "✕ "}
            {status.message}
          </div>
        )}

        {response && status?.type === "success" && (
          <div className="response-details">
            <h3>VM Created Successfully</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Request ID:</span>
                <span className="detail-value">{response.requestId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">VM Name:</span>
                <span className="detail-value">{response.vmName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{response.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Zone:</span>
                <span className="detail-value">{response.zone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Machine Type:</span>
                <span className="detail-value">{response.machineType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Timestamp:</span>
                <span className="detail-value">{new Date(response.timestamp).toLocaleString()}</span>
              </div>
            </div>
            <div className="next-steps">
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Visit your <a href="https://console.cloud.google.com/compute/instances" target="_blank" rel="noopener noreferrer">GCP Console</a> to verify the VM</li>
                <li>Configure firewall rules if needed</li>
                <li>Connect via SSH: <code>gcloud compute ssh {response.vmName} --zone={response.zone}</code></li>
              </ul>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateVMForm;
