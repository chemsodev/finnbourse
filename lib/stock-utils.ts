import { format } from "date-fns";

// Types for API response
export interface StockPrice {
  id: string;
  stock: string;
  price: number;
  gap: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issuer {
  id: string;
  name: string;
  website: string;
  activitySector: string;
  capital: string;
  email: string;
  address: string;
  tel: string;
  createdAt: string;
  updatedAt: string;
}

export interface Institution {
  id: string;
  institutionName: string;
  taxIdentificationNumber: string;
  agreementNumber: string;
  legalForm: string;
  establishmentDate: string;
  fullAddress: string;
}

export interface Stock {
  id: string;
  name: string | null;
  stockType: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  issuer: Issuer;
  isinCode: string;
  code: string;
  faceValue: number;
  quantity: number;
  emissionDate: string;
  closingDate: string;
  enjoymentDate: string;
  maturityDate: string | null;
  marketListing: string;
  status: string;
  dividendRate: number;
  yieldRate: number | null;
  fixedRate: number | null;
  estimatedRate: number | null;
  variableRate: number | null;
  price: number;
  capitalOperation: string;
  shareClass: string | null;
  votingRights: boolean;
  master: Institution;
  repaymentMethod: string | null;
  duration: string | null;
  stockPrices: StockPrice[];
  institutions: Institution[];
  capitalRepaymentSchedule: any[];
  couponSchedule: any[];
}

// Transform API stock data to chart format
export const transformStockToChartData = (stock: Stock) => {
  const chartData = [];
  
  // Add the base stock price (current price)
  chartData.push({
    date: format(new Date(), "yyyy-MM-dd"),
    price: stock.price,
    gap: 0,
    stockId: stock.id,
    stockName: stock.issuer.name,
    stockCode: stock.code,
    volume: stock.quantity,
    faceValue: stock.faceValue,
    sector: stock.issuer.activitySector,
    marketListing: stock.marketListing,
  });

  // Add historical prices
  stock.stockPrices.forEach(pricePoint => {
    chartData.push({
      date: format(new Date(pricePoint.date), "yyyy-MM-dd"),
      price: pricePoint.price,
      gap: pricePoint.gap,
      stockId: stock.id,
      stockName: stock.issuer.name,
      stockCode: stock.code,
      volume: stock.quantity,
      faceValue: stock.faceValue,
      sector: stock.issuer.activitySector,
      marketListing: stock.marketListing,
    });
  });

  // Sort by date
  return chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Transform multiple stocks for comparison
export const transformStocksForComparison = (stocks: Stock[]) => {
  const allDates = new Set<string>();
  const stockDataMap = new Map<string, any[]>();

  // Process each stock
  stocks.forEach(stock => {
    const stockData = transformStockToChartData(stock);
    stockDataMap.set(stock.id, stockData);
    
    // Collect all unique dates
    stockData.forEach(point => allDates.add(point.date));
  });

  // Create comparison data
  const comparisonData = Array.from(allDates).sort().map(date => {
    const dataPoint: any = { date };
    
    stocks.forEach((stock, index) => {
      const stockData = stockDataMap.get(stock.id) || [];
      const pricePoint = stockData.find(point => point.date === date);
      
      if (pricePoint) {
        dataPoint[`stock${index + 1}`] = pricePoint.price;
        dataPoint[`stock${index + 1}Name`] = pricePoint.stockName;
        dataPoint[`stock${index + 1}Code`] = pricePoint.stockCode;
        dataPoint[`stock${index + 1}Gap`] = pricePoint.gap;
      }
    });

    return dataPoint;
  });

  return comparisonData;
};

// Calculate stock performance metrics
export const calculateStockPerformance = (stock: Stock) => {
  if (stock.stockPrices.length === 0) {
    return {
      change: 0,
      changePercent: 0,
      trend: "stable" as const,
      volatility: 0,
      highestPrice: stock.price,
      lowestPrice: stock.price,
      averagePrice: stock.price,
    };
  }

  const prices = [stock.price, ...stock.stockPrices.map(p => p.price)];
  const sortedPrices = [...prices].sort((a, b) => a - b);
  
  const firstPrice = stock.stockPrices[0]?.price || stock.price;
  const lastPrice = stock.price;
  const change = lastPrice - firstPrice;
  const changePercent = firstPrice !== 0 ? (change / firstPrice) * 100 : 0;

  // Calculate volatility (standard deviation)
  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length;
  const volatility = Math.sqrt(variance);

  return {
    change,
    changePercent,
    trend: change > 0 ? "up" : change < 0 ? "down" : "stable" as const,
    volatility,
    highestPrice: sortedPrices[sortedPrices.length - 1],
    lowestPrice: sortedPrices[0],
    averagePrice: avg,
  };
};

// Filter stocks by criteria
export const filterStocks = (stocks: Stock[], criteria: {
  stockType?: string;
  marketListing?: string;
  activitySector?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  votingRights?: boolean;
}) => {
  return stocks.filter(stock => {
    if (criteria.stockType && stock.stockType !== criteria.stockType) return false;
    if (criteria.marketListing && stock.marketListing !== criteria.marketListing) return false;
    if (criteria.activitySector && stock.issuer.activitySector !== criteria.activitySector) return false;
    if (criteria.minPrice && stock.price < criteria.minPrice) return false;
    if (criteria.maxPrice && stock.price > criteria.maxPrice) return false;
    if (criteria.status && stock.status !== criteria.status) return false;
    if (criteria.votingRights !== undefined && stock.votingRights !== criteria.votingRights) return false;
    
    return true;
  });
};

// Group stocks by sector
export const groupStocksBySector = (stocks: Stock[]) => {
  const grouped = new Map<string, Stock[]>();
  
  stocks.forEach(stock => {
    const sector = stock.issuer.activitySector;
    if (!grouped.has(sector)) {
      grouped.set(sector, []);
    }
    grouped.get(sector)!.push(stock);
  });

  return grouped;
};

// Calculate market statistics
export const calculateMarketStats = (stocks: Stock[]) => {
  if (stocks.length === 0) return null;

  const totalMarketCap = stocks.reduce((sum, stock) => sum + (stock.price * stock.quantity), 0);
  const avgPrice = stocks.reduce((sum, stock) => sum + stock.price, 0) / stocks.length;
  const prices = stocks.map(stock => stock.price);
  const sortedPrices = [...prices].sort((a, b) => a - b);

  // Calculate overall market performance
  const performanceMetrics = stocks.map(stock => calculateStockPerformance(stock));
  const avgPerformance = performanceMetrics.reduce((sum, metric) => sum + metric.changePercent, 0) / performanceMetrics.length;

  // Group by sector
  const sectorGroups = groupStocksBySector(stocks);
  const sectorStats = Array.from(sectorGroups.entries()).map(([sector, sectorStocks]) => {
    const sectorMarketCap = sectorStocks.reduce((sum, stock) => sum + (stock.price * stock.quantity), 0);
    const sectorAvgPrice = sectorStocks.reduce((sum, stock) => sum + stock.price, 0) / sectorStocks.length;
    
    return {
      sector,
      count: sectorStocks.length,
      marketCap: sectorMarketCap,
      avgPrice: sectorAvgPrice,
      percentage: (sectorMarketCap / totalMarketCap) * 100,
    };
  });

  return {
    totalStocks: stocks.length,
    totalMarketCap,
    avgPrice,
    medianPrice: sortedPrices[Math.floor(sortedPrices.length / 2)],
    highestPrice: sortedPrices[sortedPrices.length - 1],
    lowestPrice: sortedPrices[0],
    avgPerformance,
    sectorStats,
    marketListings: {
      PRINCIPAL: stocks.filter(s => s.marketListing === "PRINCIPAL").length,
      PME: stocks.filter(s => s.marketListing === "PME").length,
    },
  };
};

// Format stock data for export
export const formatStockForExport = (stock: Stock) => {
  const performance = calculateStockPerformance(stock);
  
  return {
    id: stock.id,
    name: stock.issuer.name,
    code: stock.code,
    isinCode: stock.isinCode,
    sector: stock.issuer.activitySector,
    stockType: stock.stockType,
    marketListing: stock.marketListing,
    currentPrice: stock.price,
    faceValue: stock.faceValue,
    quantity: stock.quantity,
    dividendRate: stock.dividendRate,
    votingRights: stock.votingRights,
    emissionDate: stock.emissionDate,
    closingDate: stock.closingDate,
    maturityDate: stock.maturityDate,
    status: stock.status,
    performance: {
      change: performance.change,
      changePercent: performance.changePercent,
      trend: performance.trend,
      volatility: performance.volatility,
      highestPrice: performance.highestPrice,
      lowestPrice: performance.lowestPrice,
      averagePrice: performance.averagePrice,
    },
    issuer: {
      name: stock.issuer.name,
      website: stock.issuer.website,
      sector: stock.issuer.activitySector,
      capital: stock.issuer.capital,
      email: stock.issuer.email,
      address: stock.issuer.address,
      tel: stock.issuer.tel,
    },
    priceHistory: stock.stockPrices.map(price => ({
      date: price.date,
      price: price.price,
      gap: price.gap,
    })),
  };
};
