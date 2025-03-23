"use client";

import { useLocale } from "next-intl";
import LocalesList from "./LocalesList";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const LocaleButton = () => {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLocales = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LocalesList />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={toggleLocales}
        className="bg-primary text-white capitalize px-2 ltr:rounded-r-lg rtl:rounded-l-lg h-full"
      >
        {locale}
      </button>
    </div>
  );
};

export default LocaleButton;
