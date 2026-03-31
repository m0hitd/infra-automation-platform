import React from "react";

function ApiStatus({ status }) {
  return (
    <div className={`Api-status ${status}`}>
      <span className={`Api-status-indicator ${status}`}></span>
      {status === "online" && "✅ API Server Online"}
      {status === "offline" && "❌ API Server Offline"}
      {status === "checking" && "🔄 Checking API..."}
    </div>
  );
}

export default ApiStatus;
