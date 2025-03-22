"use client";

import { useFormatter } from "next-intl";

const DateTimeDisplay = ({ dateTime }: { dateTime: Date }) => {
  const format = useFormatter();

  return (
    <div className="flex items-baseline gap-1 mx-2 mt-8 md:mt-0">
      <div className="font-semibold text-primary capitalize">
        {format.dateTime(dateTime, { weekday: "long" })} :
      </div>
      <div className="text-xs font-semibold text-gray-400">
        {format.dateTime(dateTime, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    </div>
  );
};

export default DateTimeDisplay;
