"use client";

import { useFormatter } from "next-intl";

export default function FormattedDate({ date }: { date: Date }) {
  const format = useFormatter();

  return (
    <>
      <div className="font-semibold text-primary capitalize">
        {format.dateTime(date, {
          weekday: "long",
        })}
        :
      </div>
      <div className="text-xs font-semibold text-gray-400">
        {format.dateTime(date, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    </>
  );
}
