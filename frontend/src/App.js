import React, { useState, useEffect } from "react";
import "./App.css";
import CreateVMForm from "./components/CreateVMForm";
import RequestsList from "./components/RequestsList";
import ApiStatus from "./components/ApiStatus";

function App() {
  const [requests, setRequests] = useState([]);
  const [apiStatus, setApiStatus] = useState("checking");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch("http://localhost:3000/health");
      if (response.ok) {
        setApiStatus("online");
        fetchRequests();
      } else {
        setApiStatus("offline");
      }
    } catch (error) {
      setApiStatus("offline");
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:3000/requests");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  const handleVMCreated = (newRequest) => {
    setRequests([...requests, newRequest]);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = (req.vmName || req.bucketName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (req.requestId || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: requests.length,
    success: requests.filter(r => r.status === "success").length,
    pending: requests.filter(r => r.status === "pending").length,
    failed: requests.filter(r => r.status === "failed").length,
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Infrastructure Automation Platform</h1>
          <p className="subtitle">Provision cloud resources with Terraform on GCP</p>
          <ApiStatus status={apiStatus} />
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`tab-button ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              Create Resources
            </button>
            <button
              className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("requests");
                fetchRequests();
              }}
            >
              View Requests ({requests.length})
            </button>
            <button
              className={`tab-button ${activeTab === "docs" ? "active" : ""}`}
              onClick={() => setActiveTab("docs")}
            >
              API Docs
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "dashboard" && (
              <div className="dashboard">
                <h2>Dashboard Overview</h2>
                
                <div className="stats-overview">
                  <div className="stat-card">
                    <div className="stat-icon total">📊</div>
                    <div className="stat-details">
                      <div className="stat-value">{stats.total}</div>
                      <div className="stat-name">Total Requests</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon success">✓</div>
                    <div className="stat-details">
                      <div className="stat-value">{stats.success}</div>
                      <div className="stat-name">Successful</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon pending">⏳</div>
                    <div className="stat-details">
                      <div className="stat-value">{stats.pending}</div>
                      <div className="stat-name">Pending</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon failed">✕</div>
                    <div className="stat-details">
                      <div className="stat-value">{stats.failed}</div>
                      <div className="stat-name">Failed</div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-sections">
                  <div className="dashboard-section">
                    <h3>Quick Actions</h3>
                    <div className="action-buttons">
                      <button className="action-btn" onClick={() => setActiveTab("create")}>
                        <span className="action-icon">+</span> Create New VM
                      </button>
                      <button className="action-btn" onClick={() => {
                        setActiveTab("requests");
                        fetchRequests();
                      }}>
                        <span className="action-icon">→</span> View All Requests
                      </button>
                      <button className="action-btn" onClick={() => {
                        const csv = requests.map(r => `${r.vmName || r.bucketName},${r.status},${r.timestamp}`).join('\n');
                        const element = document.createElement("a");
                        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent("Name,Status,Date\n" + csv));
                        element.setAttribute("download", "requests.csv");
                        element.click();
                      }}>
                        <span className="action-icon">↓</span> Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-section">
                    <h3>System Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">API Status:</span>
                        <span className={`info-value status-${apiStatus}`}>{apiStatus.toUpperCase()}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Backend URL:</span>
                        <span className="info-value">http://localhost:3000</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Frontend URL:</span>
                        <span className="info-value">http://localhost:3001</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Success Rate:</span>
                        <span className="info-value">{stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {requests.length > 0 && (
                  <div className="recent-activity">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                      {requests.slice(-5).reverse().map((req, idx) => (
                        <div key={idx} className="activity-item">
                          <span className={`activity-status ${req.status}`}>●</span>
                          <span className="activity-text">
                            <strong>{req.vmName || req.bucketName}</strong> - {req.status}
                          </span>
                          <span className="activity-time">
                            {new Date(req.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "create" && (
              <CreateVMForm 
                onVMCreated={handleVMCreated}
                apiStatus={apiStatus}
              />
            )}

            {activeTab === "requests" && (
              <div className="requests-view">
                <div className="search-filter-bar">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by VM name or Request ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <RequestsList requests={filteredRequests} />
              </div>
            )}

            {activeTab === "docs" && (
              <div className="api-docs">
                <h2>API Documentation</h2>
                <div className="docs-grid">
                  <div className="doc-section">
                    <h3>Create VM</h3>
                    <div className="doc-content">
                      <p><strong>Endpoint:</strong> POST /create-vm</p>
                      <p><strong>Description:</strong> Creates a new virtual machine on GCP</p>
                      <div className="doc-code">
                        <pre>{`{
  "vmName": "my-vm",
  "machineType": "e2-micro",
  "zone": "asia-south1-a",
  "image": "debian-11"
}`}</pre>
                      </div>
                    </div>
                  </div>

                  <div className="doc-section">
                    <h3>Get Requests</h3>
                    <div className="doc-content">
                      <p><strong>Endpoint:</strong> GET /requests</p>
                      <p><strong>Description:</strong> Retrieves all infrastructure requests</p>
                      <p><strong>Response:</strong> Array of request objects with status and details</p>
                    </div>
                  </div>

                  <div className="doc-section">
                    <h3>Health Check</h3>
                    <div className="doc-content">
                      <p><strong>Endpoint:</strong> GET /health</p>
                      <p><strong>Description:</strong> Checks API server status</p>
                      <p><strong>Response:</strong> {"{\"status\": \"ok\"}"}</p>
                    </div>
                  </div>

                  <div className="doc-section">
                    <h3>Machine Types</h3>
                    <div className="doc-content">
                      <p><strong>Available Options:</strong></p>
                      <ul>
                        <li>e2-micro (0.5-2 vCPU)</li>
                        <li>e2-small (0.5-2 vCPU)</li>
                        <li>e2-medium (1-2 vCPU)</li>
                        <li>n1-standard-1 (1 vCPU)</li>
                        <li>n1-standard-4 (4 vCPU)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="doc-section">
                    <h3>Available Zones</h3>
                    <div className="doc-content">
                      <p><strong>GCP Zones:</strong></p>
                      <ul>
                        <li>asia-south1-a (Delhi)</li>
                        <li>us-central1-a (Iowa)</li>
                        <li>europe-west1-b (Belgium)</li>
                        <li>asia-east1-a (Taiwan)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="doc-section">
                    <h3>Error Handling</h3>
                    <div className="doc-content">
                      <p><strong>Error Codes:</strong></p>
                      <ul>
                        <li>400 - Bad Request (invalid parameters)</li>
                        <li>500 - Server Error (terraform failure)</li>
                        <li>503 - Service Unavailable</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>Infrastructure Automation Platform | Powered by Terraform & GCP</p>
        <p className="footer-tech">Technologies: Node.js • React • Terraform • Google Cloud Platform</p>
      </footer>
    </div>
  );
}

export default App;
