"use client";

import { useState, useEffect } from "react";
import { useTCC } from "@/hooks/useTCC";
import { useRestToken } from "@/hooks/useRestToken";

export default function TCCDiagnosticsPage() {
  const { tcc, isLoading, fetchTCC } = useTCC();
  const { hasRestToken, isLoading: tokenLoading } = useRestToken();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    addLog("Component mounted");
    addLog(`Token loading: ${tokenLoading}`);
    addLog(`Has REST token: ${hasRestToken}`);
    addLog(`TCC loading: ${isLoading}`);
    addLog(`TCC data: ${JSON.stringify(tcc, null, 2)}`);

    if (hasRestToken && !tokenLoading) {
      addLog("Attempting to fetch TCC data...");
      fetchTCC()
        .then(() => {
          addLog("TCC fetch completed");
        })
        .catch((error) => {
          addLog(`TCC fetch error: ${error.message}`);
        });
    }
  }, [hasRestToken, tokenLoading]);

  useEffect(() => {
    addLog(`TCC data updated: ${JSON.stringify(tcc, null, 2)}`);
    if (tcc?.users) {
      addLog(`Users array length: ${tcc.users.length}`);
      addLog(`Users data: ${JSON.stringify(tcc.users, null, 2)}`);
    }
  }, [tcc]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">TCC Diagnostics</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Current State</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p>
            <strong>Token Loading:</strong> {String(tokenLoading)}
          </p>
          <p>
            <strong>Has REST Token:</strong> {String(hasRestToken)}
          </p>
          <p>
            <strong>TCC Loading:</strong> {String(isLoading)}
          </p>
          <p>
            <strong>TCC Data:</strong> {tcc ? "Present" : "Null"}
          </p>
          <p>
            <strong>Users Count:</strong> {tcc?.users?.length || 0}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">TCC Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(tcc, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Users Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(tcc?.users, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Debug Logs</h2>
        <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1 text-sm">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
