"use client";

import React from "react";
import { TrendingUp, Wallet, DollarSign } from "lucide-react";

export default function StaticTopBarDash() {
  const mockWalletData = {
    totalValue: 1150000,
    dailyChange: 15200,
    dailyChangePercentage: 1.34,
    currency: "EUR",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "k";
    }
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
            <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Valeur totale du portefeuille
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(mockWalletData.totalValue)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`flex items-center space-x-1 ${
              mockWalletData.dailyChange >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">
              {mockWalletData.dailyChange >= 0 ? "+" : ""}
              {formatCurrency(mockWalletData.dailyChange)}
            </span>
          </div>
          <div
            className={`text-sm ${
              mockWalletData.dailyChangePercentage >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {mockWalletData.dailyChangePercentage >= 0 ? "+" : ""}
            {mockWalletData.dailyChangePercentage.toFixed(2)}% aujourd'hui
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">
              Liquidités
            </span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {formatCurrency(125000)}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">Investis</span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {formatCurrency(1025000)}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400">
              P&L Total
            </span>
          </div>
          <p className="font-semibold text-green-600">
            +{formatCurrency(150000)}
          </p>
        </div>
      </div>
    </div>
  );
}
