// Example usage of the enhanced chart components
// This file demonstrates how to use the new chart utilities and components

import React from "react";
import {
  EnhancedChart,
  StockPriceChart,
  VolumeChart,
} from "@/components/charts/EnhancedChart";
import { useChartData } from "@/hooks/useChartData";
import { formatChartDate, formatChartValue } from "@/lib/chart-utils";

// Sample data for demonstration
const sampleStockData = [
  { date: "2024-01-01", price: 100, volume: 1000000 },
  { date: "2024-01-02", price: 105, volume: 1200000 },
  { date: "2024-01-03", price: 102, volume: 800000 },
  { date: "2024-01-04", price: 108, volume: 1500000 },
  { date: "2024-01-05", price: 112, volume: 1800000 },
  { date: "2024-01-06", price: 115, volume: 2000000 },
  { date: "2024-01-07", price: 110, volume: 1600000 },
  { date: "2024-01-08", price: 118, volume: 2200000 },
  { date: "2024-01-09", price: 122, volume: 2500000 },
  { date: "2024-01-10", price: 125, volume: 2800000 },
];

// Example 1: Basic Enhanced Chart with date formatting
export const BasicEnhancedChartExample = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Basic Enhanced Chart Example</h2>

      <EnhancedChart
        data={sampleStockData}
        series={[{ key: "price", name: "Stock Price", color: "#8884d8" }]}
        chartType="line"
        title="Stock Price Over Time"
        subtitle="Enhanced with improved date formatting"
        valueType="currency"
        height={400}
        showDots={true}
        strokeWidth={2}
        gradientFill={false}
      />
    </div>
  );
};

// Example 2: Stock Price Chart with date range filtering
export const StockPriceChartExample = () => {
  const { data, loading, error, dateRange, applyDateRangePreset, statistics } =
    useChartData({
      data: sampleStockData,
      initialDateRange: "30d",
      enableAutoRefresh: false,
    });

  const securities = [{ key: "price", name: "Stock Price", color: "#8884d8" }];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Stock Price Chart with Data Hook</h2>

      {/* Date Range Selection */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => applyDateRangePreset("7d")}
          className={`px-3 py-1 rounded ${
            dateRange === "7d" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          7D
        </button>
        <button
          onClick={() => applyDateRangePreset("30d")}
          className={`px-3 py-1 rounded ${
            dateRange === "30d" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          30D
        </button>
        <button
          onClick={() => applyDateRangePreset("90d")}
          className={`px-3 py-1 rounded ${
            dateRange === "90d" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          90D
        </button>
      </div>

      {/* Statistics Display */}
      {statistics && statistics.price && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Min</p>
            <p className="text-lg font-bold">
              {formatChartValue(statistics.price.min, "currency", "en")}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Max</p>
            <p className="text-lg font-bold">
              {formatChartValue(statistics.price.max, "currency", "en")}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-lg font-bold">
              {formatChartValue(statistics.price.avg, "currency", "en")}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Change</p>
            <p
              className={`text-lg font-bold ${
                statistics.price.changePercent >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatChartValue(
                statistics.price.changePercent,
                "percentage",
                "en"
              )}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
          <p>Loading chart data...</p>
        </div>
      ) : error ? (
        <div className="h-96 bg-red-100 rounded flex items-center justify-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : (
        <StockPriceChart
          data={data}
          securities={securities}
          title="Stock Price Analysis"
        />
      )}
    </div>
  );
};

// Example 3: Volume Chart
export const VolumeChartExample = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Volume Chart Example</h2>

      <VolumeChart
        data={sampleStockData}
        volumeKey="volume"
        title="Trading Volume"
      />
    </div>
  );
};

// Example 4: Multi-series Chart (Price and Volume)
export const MultiSeriesChartExample = () => {
  // Normalize volume data to fit with price scale
  const normalizedData = sampleStockData.map((item) => ({
    ...item,
    normalizedVolume: item.volume / 100000, // Scale down volume for visibility
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Multi-Series Chart Example</h2>

      <EnhancedChart
        data={normalizedData}
        series={[
          { key: "price", name: "Stock Price", color: "#8884d8" },
          { key: "normalizedVolume", name: "Volume (100k)", color: "#82ca9d" },
        ]}
        chartType="line"
        title="Stock Price and Volume"
        subtitle="Multiple data series with proper scaling"
        valueType="number"
        height={400}
        showDots={true}
        strokeWidth={2}
      />
    </div>
  );
};

// Example 5: Date formatting utilities demonstration
export const DateFormattingExample = () => {
  const sampleDate = "2024-01-15";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Date Formatting Examples</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">English Formatting</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Short format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "short", "en")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Medium format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "medium", "en")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Long format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "long", "en")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ISO format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "iso", "en")}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">French Formatting</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Short format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "short", "fr")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Medium format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "medium", "fr")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Long format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "long", "fr")}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Arabic Formatting</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Short format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "short", "ar")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Medium format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "medium", "ar")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Long format:</p>
              <p className="font-mono">
                {formatChartDate(sampleDate, "long", "ar")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example 6: Value formatting demonstration
export const ValueFormattingExample = () => {
  const sampleValues = {
    currency: 1234.56,
    percentage: 12.34,
    number: 1234567.89,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Value Formatting Examples</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Currency Formatting</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">English:</p>
              <p className="font-mono">
                {formatChartValue(sampleValues.currency, "currency", "en")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">French:</p>
              <p className="font-mono">
                {formatChartValue(sampleValues.currency, "currency", "fr")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Arabic:</p>
              <p className="font-mono">
                {formatChartValue(sampleValues.currency, "currency", "ar")}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Percentage Formatting</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">English:</p>
              <p className="font-mono">
                {formatChartValue(sampleValues.percentage, "percentage", "en")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">French:</p>
              <p className="font-mono">
                {formatChartValue(sampleValues.percentage, "percentage", "fr")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Arabic:</p>
              <p className="font-mono">
                {formatChartValue(sampleValues.percentage, "percentage", "ar")}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Number Formatting</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">English:</p>
              <p className="font-mono">
                {formatChartValue(sampleValues.number, "number", "en")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">French:</p>
              <p className="font-mono">
                {formatChartValue(sampleValues.number, "number", "fr")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Arabic:</p>
              <p className="font-mono">
                {formatChartValue(sampleValues.number, "number", "ar")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main demo component combining all examples
export const ChartImprovementsDemo = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Chart Improvements Demo</h1>
        <p className="text-lg text-gray-600">
          Demonstrating enhanced date formatting, multi-locale support, and
          improved chart functionality
        </p>
      </div>

      <BasicEnhancedChartExample />
      <StockPriceChartExample />
      <VolumeChartExample />
      <MultiSeriesChartExample />
      <DateFormattingExample />
      <ValueFormattingExample />
    </div>
  );
};

export default ChartImprovementsDemo;
