"use client"
import React, { useState } from "react";

const UserTypeSwitch = () => {
  const [selected, setSelected] = useState("client");

  return (
    <div className="flex items-center justify-start">
      <div className="bg-gray-200 rounded-full flex">
        <button
          onClick={() => setSelected("client")}
          className={`px-4 rounded-full transition-all duration-300 ${
            selected === "client"
              ? "bg-[#143C3C] text-green-400 font-semibold"
              : "text-gray-500"
          }`}
        >
          U clients
        </button>
        <button
          onClick={() => setSelected("admin")}
          className={`px-4 rounded-full transition-all duration-300 ${
            selected === "admin"
              ? "bg-[#143C3C] text-green-400 font-semibold"
              : "text-gray-500"
          }`}
        >
          U ADMIN
        </button>
      </div>
    </div>
  );
};

export default UserTypeSwitch;
