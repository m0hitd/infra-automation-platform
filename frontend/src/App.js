import React, { useState, useEffect } from "react";
import "./App.css";
import CreateVMForm from "./components/CreateVMForm";
import RequestsList from "./components/RequestsList";
import ApiStatus from "./components/ApiStatus";

function App() {
  const [requests, setRequests] = useState([]);
  const [apiStatus, setApiStatus] = useState("checking");
  const [activeTab, setActiveTab] = useState("create");

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

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>🚀 Infrastructure Automation Platform</h1>
          <p className="subtitle">Provision cloud resources with Terraform on GCP</p>
          <ApiStatus status={apiStatus} />
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              📦 Create Resources
            </button>
            <button
              className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("requests");
                fetchRequests();
              }}
            >
              📋 View Requests ({requests.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "create" && (
              <CreateVMForm 
                onVMCreated={handleVMCreated}
                apiStatus={apiStatus}
              />
            )}
            {activeTab === "requests" && (
              <RequestsList requests={requests} />
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
