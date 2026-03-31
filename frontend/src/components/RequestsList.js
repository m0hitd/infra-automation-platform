import React from "react";

function RequestsList({ requests }) {
  if (requests.length === 0) {
    return (
      <div className="empty-state">
        <h3>📭 No Requests Yet</h3>
        <p>Create your first virtual machine to see it here</p>
      </div>
    );
  }

  return (
    <div className="requests-section">
      <h2>📋 Infrastructure Requests</h2>
      <p className="form-description">
        View all infrastructure provisioning requests and their status
      </p>

      <div className="requests-list">
        {requests.map((request, index) => (
          <div key={index} className="request-card">
            <div className="request-header">
              <div className="request-info">
                <span className="request-type">
                  {request.type === "create-vm" && "🖥️ Virtual Machine"}
                  {request.type === "create-storage" && "💾 Storage Bucket"}
                  {request.type === "destroy" && "🗑️ Destroy"}
                </span>
                <span className="request-name">{request.vmName || request.bucketName}</span>
              </div>
              <span className={`request-status ${request.status}`}>
                {request.status === "success" && "✅ Success"}
                {request.status === "pending" && "⏳ Pending"}
                {request.status === "failed" && "❌ Failed"}
              </span>
            </div>

            <div className="request-time">
              📅 {new Date(request.timestamp).toLocaleString()}
            </div>

            {request.requestId && (
              <div className="request-detail">
                <strong>Request ID:</strong> <code>{request.requestId}</code>
              </div>
            )}

            {request.machineType && (
              <div className="request-detail">
                <strong>Machine Type:</strong> {request.machineType}
              </div>
            )}

            {request.zone && (
              <div className="request-detail">
                <strong>Zone:</strong> {request.zone}
              </div>
            )}

            {request.error && (
              <div className="request-error">
                <strong>Error:</strong> {request.error}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="requests-stats">
        <h3>📊 Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{requests.length}</span>
            <span className="stat-label">Total Requests</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{requests.filter(r => r.status === "success").length}</span>
            <span className="stat-label">Successful</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{requests.filter(r => r.status === "failed").length}</span>
            <span className="stat-label">Failed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestsList;
