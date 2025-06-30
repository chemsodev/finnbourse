// Mock data for use during development or when API is unavailable
import { Order } from "@/lib/interfaces";
import { v4 as uuidv4 } from "uuid";

/**
 * Mock order data for development
 * Order Status Flow:
 * 0 - Draft (initial state)
 * 1 - Pending (waiting for agency_first_approver)
 * 2 - In Progress (waiting for agency_final_approver)
 * 3 - Validated (waiting for tcc_first_approver)
 * 4 - Being Processed (waiting for tcc_final_approver)
 * 5 - Completed (waiting for iob_order_executor)
 * 6 - Awaiting Approval (waiting for iob_result_submitter)
 * 7 - Ongoing (in execution)
 * 8 - Partially Validated
 * 9 - Expired
 * 10 - Rejected
 * 11 - Cancelled
 */

// Secondary market security types
const secondaryMarketSecurityTypes = [
  "action",
  "obligation",
  "sukukms",
  "titresparticipatif",
];

// Primary market security types
const primaryMarketSecurityTypes = [
  "empruntobligataire",
  "opv",
  "sukukmp",
  "titresparticipatifsmp",
];

// Companies
const companies = [
  "Sonatrach",
  "CPA",
  "BNA",
  "Saidal",
  "Sonelgaz",
  "Air Algérie",
  "BEA",
  "Cevital",
  "Biopharm",
  "Alliance Assurances",
];

// Helper function to generate a random date within the last 60 days
const randomDate = () => {
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - Math.floor(Math.random() * 60));
  return pastDate.toISOString();
};

// Generate a single mock order
const generateMockOrder = (
  orderstatus: number,
  isPrimary: boolean = false
): Order => {
  const securitytype = isPrimary
    ? primaryMarketSecurityTypes[
        Math.floor(Math.random() * primaryMarketSecurityTypes.length)
      ]
    : secondaryMarketSecurityTypes[
        Math.floor(Math.random() * secondaryMarketSecurityTypes.length)
      ];

  const company = companies[Math.floor(Math.random() * companies.length)];
  const quantity = Math.floor(Math.random() * 1000) + 100;
  const price = Math.floor(Math.random() * 10000) + 500;
  const orderDate = randomDate();
  const emissionDate = new Date();
  emissionDate.setDate(
    emissionDate.getDate() + Math.floor(Math.random() * 365)
  );
  const validityDate = new Date(emissionDate);
  validityDate.setDate(validityDate.getDate() + 30);

  // Common fields
  const baseOrder = {
    id: uuidv4(),
    securityissuer: company,
    securitytype,
    securityid: uuidv4().slice(0, 8),
    securityquantity: quantity * 10,
    quantity,
    orderdate: orderDate,
    orderstatus,
    investorid: `INV-${Math.floor(Math.random() * 10000)}`,
    negotiatorid: `NEG-${Math.floor(Math.random() * 100)}`,
    validity: "30",
    duration: Math.floor(Math.random() * 30) + 1,
    createdat: orderDate,
    payedWithCard: Math.random() > 0.7,
    visaCosob: `VISA-${Math.floor(Math.random() * 10000)}`,
    isinCode: `DZ${Math.floor(Math.random() * 10000000000)}`,
    emissionDate: emissionDate.toISOString(),
  };

  if (isPrimary) {
    // Souscription specific fields
    return {
      ...baseOrder,
      bdl: `${price} DA`,
      totalShares: Math.floor(Math.random() * 50000000) + 1000000,
      commission: "Pas de Commission",
      netAmount: `${price.toFixed(2)} DA`,
    };
  } else {
    // Ordre specific fields
    const grossAmount = price;
    const commission = 0.9;
    const netAmount = grossAmount * (1 + commission / 100);

    return {
      ...baseOrder,
      mst: `${price} DA`,
      orderdirection: Math.random() > 0.5 ? 1 : 0,
      priceInstruction: "au mieux",
      timeInstruction: "à durée limitée",
      validityDate: validityDate.toISOString(),
      totalShares: Math.floor(Math.random() * 1000000) + 100000,
      grossAmount: `${grossAmount.toFixed(2)} DA`,
      commission: `${commission} %`,
      netAmount: `${netAmount.toFixed(2)} DA`,
    };
  }
};

// Generate orders with specific statuses for different roles
export const generateMockOrders = (count: number = 100): Order[] => {
  const orders: Order[] = [];

  // Generate orders for all statuses from 0 to 11
  for (let status = 0; status <= 11; status++) {
    // Generate orders for secondary market (carnet d'ordres)
    for (let i = 0; i < count / 24; i++) {
      orders.push(generateMockOrder(status, false));
    }

    // Generate orders for primary market (souscriptions)
    for (let i = 0; i < count / 24; i++) {
      orders.push(generateMockOrder(status, true));
    }
  }

  return orders;
};

// Generate a fixed set of mock orders
export const mockOrders = generateMockOrders(240);

// Filter helpers
export const filterOrdersBySearchQuery = (
  orders: Order[],
  searchquery: string
) => {
  if (!searchquery) return orders;

  const query = searchquery.toLowerCase();
  return orders.filter(
    (order) =>
      order.securityissuer.toLowerCase().includes(query) ||
      order.securitytype.toLowerCase().includes(query) ||
      order.investorid.toLowerCase().includes(query) ||
      order.negotiatorid.toLowerCase().includes(query) ||
      order.securityid.toLowerCase().includes(query)
  );
};

export const filterOrdersByStatus = (orders: Order[], state: string) => {
  if (state === "99") return orders; // All statuses

  const statusNumber = parseInt(state, 10);
  return orders.filter((order) => order.orderstatus === statusNumber);
};

export const filterOrdersByMarketType = (
  orders: Order[],
  marketType: string
) => {
  if (marketType === "all") return orders;

  if (marketType === "primaire") {
    return orders.filter((order) =>
      primaryMarketSecurityTypes.includes(order.securitytype)
    );
  } else if (marketType === "secondaire") {
    return orders.filter((order) =>
      secondaryMarketSecurityTypes.includes(order.securitytype)
    );
  }

  return orders;
};

export const paginateOrders = (
  orders: Order[],
  skip: number,
  take: number = 10
) => {
  const startIndex = skip * take;
  return orders.slice(startIndex, startIndex + take);
};
