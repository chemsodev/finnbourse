"use client";

import { useEffect, useState } from "react";

interface TestComponentProps {
  type: string;
}

export function TestComponent({ type }: TestComponentProps) {
  const [message, setMessage] = useState("Initializing...");

  useEffect(() => {
    console.log("TestComponent mounted with type:", type);
    setMessage(`Component loaded for type: ${type}`);
  }, [type]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc" }}>
      <h3>Test Component</h3>
      <p>{message}</p>
      <p>If you can see this, the page is loading correctly.</p>
    </div>
  );
}
