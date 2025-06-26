/**
 * staticData.ts
 * -----------------------
 * Static data for components that previously used GraphQL
 * Replace GraphQL queries with mock data for offline functionality
 */

// Mock orders data
export const mockOrders = [
  {
    id: "order_001",
    ordertypes: ["MARKET", "IMMEDIATE"],
    orderdirection: 1, // BUY
    securityid: "security_001",
    securitytype: "STOCK",
    securityissuer: "TechCorp SA",
    quantity: 100,
    pricelimitmin: 45.5,
    pricelimitmax: 46.0,
    duration: 30,
    orderdate: new Date().toISOString(),
    orderstatus: 1, // PENDING
    investorid: "investor_001",
    negotiatorid: "negotiator_001",
    validity: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    createdat: new Date().toISOString(),
  },
  {
    id: "order_002",
    ordertypes: ["LIMIT"],
    orderdirection: 0, // SELL
    securityid: "security_002",
    securitytype: "BOND",
    securityissuer: "FinanceBank SA",
    quantity: 50,
    pricelimitmin: 102.0,
    pricelimitmax: 102.5,
    duration: 7,
    orderdate: new Date().toISOString(),
    orderstatus: 3, // EXECUTED
    investorid: "investor_002",
    negotiatorid: "negotiator_001",
    validity: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdat: new Date().toISOString(),
  },
];

// Mock portfolio data
export const mockPortfolio = [
  {
    id: "portfolio_001",
    userid: "user_001",
    issuer: "TechCorp SA",
    assettype: "STOCK",
    assetid: "security_001",
    quantity: 150,
    totalPayed: 6825.0,
  },
  {
    id: "portfolio_002",
    userid: "user_001",
    issuer: "FinanceBank SA",
    assettype: "BOND",
    assetid: "security_002",
    quantity: 25,
    totalPayed: 2550.0,
  },
];

// Mock securities data
export const mockStocks = [
  {
    id: "security_001",
    type: "action",
    name: "TechCorp Ordinary Shares",
    isincode: "XS0123456789",
    issuer: "TechCorp SA",
    code: "TECH",
    listedcompanyid: "company_001",
    marketlisting: "PRIMARY",
    emissiondate: "2023-01-15T00:00:00.000Z",
    enjoymentdate: "2023-01-15T00:00:00.000Z",
    quantity: 1000000,
    shareclass: "ORDINARY",
    facevalue: 45.5,
    marketmetadata: { sector: "Technology", market: "NSE" },
    dividendrate: 3.5,
  },
  {
    id: "security_003",
    type: "action",
    name: "EnergyPower Shares",
    isincode: "XS0987654321",
    issuer: "EnergyPower SA",
    code: "ENPW",
    listedcompanyid: "company_003",
    marketlisting: "SECONDARY",
    emissiondate: "2023-03-10T00:00:00.000Z",
    enjoymentdate: "2023-03-10T00:00:00.000Z",
    quantity: 500000,
    shareclass: "ORDINARY",
    facevalue: 78.2,
    marketmetadata: { sector: "Energy", market: "NSE" },
    dividendrate: 4.2,
  },
];

export const mockBonds = [
  {
    id: "security_002",
    type: "obligation",
    name: "FinanceBank Corporate Bond 2025",
    isincode: "XS0555666777",
    issuer: "FinanceBank SA",
    code: "FINB25",
    listedcompanyid: "company_002",
    marketlisting: "PRIMARY",
    emissiondate: "2023-02-01T00:00:00.000Z",
    enjoymentdate: "2023-02-01T00:00:00.000Z",
    maturitydate: "2025-02-01T00:00:00.000Z",
    quantity: 100000,
    facevalue: 102.0,
    couponrate: 5.5,
    yieldrate: 5.2,
    repaymentmethod: "AT_MATURITY",
    couponschedule: [
      { year: 2023, rate: 5.5 },
      { year: 2024, rate: 5.5 },
      { year: 2025, rate: 5.5 },
    ],
  },
];

// Mock listed companies
export const mockListedCompanies = [
  {
    id: "company_001",
    nom: "TechCorp SA",
    secteuractivite: "Technology",
    capitalisationboursiere: "50000000",
    contact: {
      phone: "+212-522-123456",
      email: "contact@techcorp.ma",
      address: "123 Tech Street, Casablanca, Morocco",
    },
    siteofficiel: "https://techcorp.ma",
    extrafields: {
      notice: "Leading technology company in Morocco",
    },
  },
  {
    id: "company_002",
    nom: "FinanceBank SA",
    secteuractivite: "Banking",
    capitalisationboursiere: "120000000",
    contact: {
      phone: "+212-522-654321",
      email: "info@financebank.ma",
      address: "456 Finance Avenue, Rabat, Morocco",
    },
    siteofficiel: "https://financebank.ma",
    extrafields: {
      notice: "Premier banking institution in Morocco",
    },
  },
  {
    id: "company_003",
    nom: "EnergyPower SA",
    secteuractivite: "Energy",
    capitalisationboursiere: "85000000",
    contact: {
      phone: "+212-522-789012",
      email: "contact@energypower.ma",
      address: "789 Energy Boulevard, Casablanca, Morocco",
    },
    siteofficiel: "https://energypower.ma",
    extrafields: {
      notice: "Renewable energy leader in North Africa",
    },
  },
];

// Mock user data
export const mockUsers = [
  {
    id: "user_001",
    fullname: "Ahmed Ben Hassan",
    email: "ahmed.hassan@email.com",
    phonenumber: "+212-661-123456",
    roleid: 1, // Investor
    negotiatorid: "negotiator_001",
    followsbusiness: true,
    status: "ACTIVE",
  },
  {
    id: "negotiator_001",
    fullname: "Fatima Al Zahra",
    email: "fatima.zahra@finnbourse.ma",
    phonenumber: "+212-661-654321",
    roleid: 2, // Negotiator
    status: "ACTIVE",
  },
];

// Mock statistics data
export const mockStatistics = {
  totalOrders: 1250,
  executedOrders: 987,
  pendingOrders: 263,
  totalVolume: 15750000,
  weeklyVolume: 2100000,
  topSecurities: [
    { issuer: "TechCorp SA", volume: 5200000, count: 145 },
    { issuer: "FinanceBank SA", volume: 3800000, count: 98 },
    { issuer: "EnergyPower SA", volume: 2900000, count: 67 },
  ],
  negotiatorPerformance: [
    { negotiatorid: "negotiator_001", volume: 8500000, count: 210 },
    { negotiatorid: "negotiator_002", volume: 4200000, count: 156 },
  ],
};

// Mock news data
export const mockNews = [
  {
    id: "news_001",
    title: "TechCorp SA Reports Strong Q3 Results",
    content:
      "TechCorp SA announced strong third-quarter results with revenue growth of 15% year-over-year...",
    language: "en",
    writerid: "admin_001",
    ispublished: true,
    createdat: new Date().toISOString(),
  },
  {
    id: "news_002",
    title: "New Bond Emission from FinanceBank SA",
    content:
      "FinanceBank SA is launching a new 3-year corporate bond with attractive yield rates...",
    language: "en",
    writerid: "admin_001",
    ispublished: true,
    createdat: new Date().toISOString(),
  },
];

// Mock support questions
export const mockSupportQuestions = [
  {
    id: "qst_001",
    question: "How do I place an order?",
    answer:
      "To place an order, navigate to the 'Place Order' section and fill in the required details including security type, quantity, and price limits.",
    state: 1, // ANSWERED
    language: "en",
    userid: "user_001",
    ispublished: true,
    description: "Basic order placement help",
  },
  {
    id: "qst_002",
    question: "What are the trading hours?",
    answer: "Trading hours are Monday to Friday, 9:00 AM to 4:00 PM GMT.",
    state: 1, // ANSWERED
    language: "en",
    userid: "user_002",
    ispublished: true,
    description: "Trading schedule information",
  },
];

// Export all mock data as a default export for easy importing
export default {
  mockOrders,
  mockPortfolio,
  mockStocks,
  mockBonds,
  mockListedCompanies,
  mockUsers,
  mockStatistics,
  mockNews,
  mockSupportQuestions,
};
