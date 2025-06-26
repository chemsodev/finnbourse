import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const preventNonNumericInput = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (
    !/[0-9]/.test(e.key) &&
    e.key !== "Backspace" &&
    e.key !== "Delete" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight"
  ) {
    e.preventDefault();
  }
};
export function formatNumber(number: number | string): string {
  // Convert to number if the input is a string
  const numberAsNumber =
    typeof number === "string" ? parseFloat(number) : number;

  // Convert to integer
  const integerNumber = Math.floor(numberAsNumber);

  // Insert a space after every three digits
  const formattedNumber = integerNumber
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return formattedNumber;
}
export function formatPrice(price: number | string): string {
  // Convert to number if the input is a string
  const priceAsNumber = typeof price === "string" ? parseFloat(price) : price;

  // Ensure the price has two decimal places
  const priceWithTwoDecimals = priceAsNumber.toFixed(2);

  // Insert a space after every three digits before the decimal point
  const formattedPrice = priceWithTwoDecimals.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " "
  );

  return formattedPrice;
}

export const formatDate = (dateString: string | Date) => {
  // Return 'N/A' for falsy values (0, null, undefined, empty string)
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  // Handle the case where the date string is in the format 'Wed Dec 25 2024 23:03:17 GMT+0100 (Central European Standard Time)'
  if (isNaN(date.getTime())) {
    const parsedDate = Date.parse(dateString.toString());
    if (!isNaN(parsedDate)) {
      return format(new Date(parsedDate), "yyyy-MM-dd");
    }
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "N/A";
  }

  return format(date, "yyyy-MM-dd");
};

export const getDefaultValiditeDate = () => {
  const currentDate = new Date();
  const nextMonthDate = new Date(
    currentDate.setMonth(currentDate.getMonth() + 1)
  );
  return nextMonthDate;
};

export const calculateTotalValue = (
  price: number,
  quantity: number,
  securityType: string
) => {
  if (price < 0 || quantity < 0 || !securityType) {
    throw new Error("Invalid input parameters");
  }
  const subtotal = price * quantity;
  const commissionRate =
    securityType.toLowerCase() === "obligation"
      ? 0.008 // 0.8%
      : 0.009; // 0.9%
  const commission = subtotal * commissionRate;
  return subtotal + commission;
};

export const getNextMonthDate = () => {
  const currentDate = new Date();
  const nextMonthDate = new Date(
    currentDate.setMonth(currentDate.getMonth() + 1)
  );
  return nextMonthDate;
};

export const updateTotalAmount = (price: number, quantity: number) => {
  return price * quantity;
};

export const calculateGrossAmount = (price: number, quantity: number) => {
  if (price < 0 || quantity < 0) {
    throw new Error("Invalid input parameters");
  }
  return price * quantity;
};

export function calculateVariation(
  cours: Array<{ date: string; price: number | string }>
) {
  if (!Array.isArray(cours) || cours.length < 2) {
    return "0.00%";
  }
  try {
    const sortedCours = cours.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    const [previous, latest] = sortedCours.slice(-2);
    const previousPrice = parseFloat(previous.price.toString());
    const latestPrice = parseFloat(latest.price.toString());
    if (isNaN(previousPrice) || isNaN(latestPrice) || previousPrice === 0) {
      return "0.00%";
    }
    const variation = ((latestPrice - previousPrice) / previousPrice) * 100;
    return variation.toFixed(2) + "%";
  } catch (error) {
    console.error("Error calculating variation:", error);
    return "0.00%";
  }
}
export const handleNumberInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: { onChange: (value: number) => void }
) => {
  const value = e.target.value;
  const cleanedValue = value.replace(/^0+/, "") || "0";
  field.onChange(Number(cleanedValue));
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
