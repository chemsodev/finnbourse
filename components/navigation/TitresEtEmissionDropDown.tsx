"use client";
import {
  Building2,
  FileText,
  FileBadge,
  ChevronDown,
  GanttChartSquare,
  Briefcase,
  CircleDollarSign,
  Building,
  BadgePercent,
  CheckCircle,
} from "lucide-react";
import NavbarLink from "./NavbarLink";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

const TitresEtEmissionDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGestionOpen, setIsGestionOpen] = useState(false);
  const t = useTranslations("TitresEtEmissionDropDown");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleGestionDropdown = () => {
    setIsGestionOpen(!isGestionOpen);
  };

  return (
    <div>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-4 py-2 px-6 w-full rounded-md hover:bg-secondary/20 hover:text-primary hover:shadow-sm text-left cursor-pointer text-xs"
      >
        <FileBadge size={15} /> {t("title")}
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
                href: "/emetteurs",
                icon: <CheckCircle size={14} />,
                label: t("emetteurs"),
              }}
            />

            <NavbarLink
              link={{
                href: "/emissions",
                icon: <GanttChartSquare size={14} />,
                label: t("emissions"),
              }}
            />

            <div>
              <button
                onClick={toggleGestionDropdown}
                className="flex items-center gap-4 py-2 px-6 w-full rounded-md hover:bg-primary/20 hover:text-primary hover:shadow-sm text-left cursor-pointer text-xs"
              >
                <Briefcase size={14} /> {t("gestionDesTitres")}
                <motion.span
                  animate={{ rotate: isGestionOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </button>

              <AnimatePresence>
                {isGestionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="text-xs bg-white shadow-inner rounded-md p-2 w-full mt-2"
                  >
                    <NavbarLink
                      link={{
                        href: "/actions",
                        icon: <CircleDollarSign size={14} />,
                        label: t("action"),
                      }}
                    />
                    <NavbarLink
                      link={{
                        href: "/obligations",
                        icon: <FileBadge size={14} />,
                        label: t("obligation"),
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TitresEtEmissionDropDown;
