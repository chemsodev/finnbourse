"use client";
import { Calculator, ChevronDown, Sparkle } from "lucide-react";
import NavbarLink from "./NavbarLink";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const OperationsSurTitresDropDown = ({
  titre,
  annonceOst,
  paiementDividendes,
  paiementDroitsDeGarde,
  paiementCoupon,
  remboursement,
}: {
  titre: string;
  annonceOst: string;
  paiementDividendes: string;
  paiementDroitsDeGarde: string;
  paiementCoupon: string;
  remboursement: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-4 py-2 px-6 w-full rounded-md hover:bg-secondary/20 hover:text-primary hover:shadow-sm text-left cursor-pointer text-xs"
      >
        <Calculator size={15} /> {titre}
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
                href: "/annonce-ost",
                icon: <Sparkle size={14} />,
                label: annonceOst,
              }}
            />
            <NavbarLink
              link={{
                href: "/paiement-de-dividendes",
                icon: <Sparkle size={14} />,
                label: paiementDividendes,
              }}
            />
            <NavbarLink
              link={{
                href: "/paiement-droits-de-garde",
                icon: <Sparkle size={14} />,
                label: paiementDroitsDeGarde,
              }}
            />
            <NavbarLink
              link={{
                href: "/paiement-coupon",
                icon: <Sparkle size={14} />,
                label: paiementCoupon,
              }}
            />
            <NavbarLink
              link={{
                href: "/remboursement",
                icon: <Sparkle size={14} />,
                label: remboursement,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OperationsSurTitresDropDown;
