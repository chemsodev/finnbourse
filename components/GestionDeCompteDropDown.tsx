"use client";
import { Wallet, ChevronDown, Receipt, Link as LinkIcon } from "lucide-react";
import NavbarLink from "./navigation/NavbarLink";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

const GestionDeCompteDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("GestionDeCompteDropDown");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-4 py-2 px-6 w-full rounded-md hover:bg-secondary/20 hover:text-primary hover:shadow-sm text-left cursor-pointer text-xs"
      >
        <Wallet size={15} /> {t("title")}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-xs bg-white shadow-inner rounded-md p-2 w-full mt-2"
          >
            <NavbarLink
              link={{
                href: "/compte-espece",
                icon: <Wallet size={14} />,
                label: t("compteEspece"),
              }}
            />
            <NavbarLink
              link={{
                href: "/compte-titre",
                icon: <Receipt size={14} />,
                label: t("compteDeTitre"),
              }}
            />
            <NavbarLink
              link={{
                href: "/lien-comptes",
                icon: <LinkIcon size={14} />,
                label: t("lienComptes"),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestionDeCompteDropDown;
