"use client";

export function StockTrackerPlaceholder() {
  return (
    <div className="p-6 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Stock Tracker</h3>
      <div className="text-center text-gray-500">
        <p>Stock tracker temporarily disabled</p>
        <p className="text-sm">Will be updated to use REST API</p>
      </div>
    </div>
  );
}
