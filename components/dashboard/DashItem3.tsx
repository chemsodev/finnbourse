import React from "react";
import DashNews from "./DashNews";
import Messages from "../Messages";

interface DashItem3Props {
  skipNews?: number;
  skipMessages?: number;
}
const DashItem3 = async () => {
  return (
    <div className="md:w-[33%] h-full space-y-4">
      <DashNews />
      <Messages />
    </div>
  );
};

export default DashItem3;
