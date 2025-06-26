import React from "react";
import StaticDashNews from "./StaticDashNews";
import StaticMessages from "../StaticMessages";

const DashItem3 = () => {
  return (
    <div className="md:w-[33%] h-full space-y-4">
      <StaticDashNews />
      <StaticMessages />
    </div>
  );
};

export default DashItem3;
