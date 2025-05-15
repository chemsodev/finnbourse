"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const TitreDrawer = ({ titreId, type }: TitreDrawerProps) => {
  const { t } = useTranslation();
  const isOpen = true; // Replace with actual state management
  const setIsOpen = () => {}; // Replace with actual state management

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        {/* Rest of content */}
      </DialogContent>
    </Dialog>
  );
};

export default TitreDrawer;
