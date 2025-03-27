"use client";
import React, { useState } from "react";
import { motion } from "framer-motion"; // Importer framer-motion
import { useRouter } from "next/navigation";
interface DropdownProps {
  onSelect?: (selection: string) => void; // Cette fonction est optionnelle, si tu veux la gérer à un niveau supérieur
}

const Dropdown: React.FC<DropdownProps> = ({ onSelect }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleSelection = (selection: string) => {
    if (onSelect) {
      onSelect(selection); // Appelle la fonction onSelect si elle est passée en prop
    }
    setDropdownOpen(false); // Fermer le dropdown après sélection
  };
  const router = useRouter();
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center bg-primary rounded-md shadow py-2 px-3 cursor-pointer text-sm text-white font-medium"
      >
        + Ajouter
      </button>
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48 z-10"
        >
          <ul className="flex flex-col">
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelection("particulier")}
            >
              Particulier
            </li>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                router.push("/utilisateurs/AddUserStep1?source=entreprise")
              }
            >
              Entreprise
            </li>

            <li
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                router.push("/utilisateurs/AddUserStep1")
              }
            >
              Institution financière
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Dropdown;
