import { formatNumber, formatPrice } from "@/lib/utils";
import { Shuffle } from "lucide-react";
import React from "react";

interface DashWidgetTccProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: React.ReactNode;
}

const DashWidgetTcc = ({
  title,
  value,
  subtitle,
  icon = <Shuffle className="w-8" />,
}: DashWidgetTccProps) => {
  return (
    <div className="h-24 text-white bg-primary w-full  rounded-md flex justify-between p-2">
      <div className="flex flex-col text-sm justify-between gap-1">
        <div>{title}</div>
        <div className="text-lg font-bold">{formatNumber(value)}</div>
        <div className="text-xs text-white">{subtitle}</div>
      </div>
      <div className="flex flex-col gap-10 items-end justify-end">
        <div className="flex">
          <div className="bg-white/40 w-6 h-6 rounded-full -mr-1"></div>
          <div className="bg-white/40 w-6 h-6 rounded-full -ml-1"></div>
        </div>
        {icon}
      </div>
    </div>
  );
};

export default DashWidgetTcc;
