"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CommissionList from "./commission-list";
import CommissionForm from "./commission-form";
import type { Commission } from "@/lib/interfaces";

export default function CommissionManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [commissions, setCommissions] = useState<Commission[]>([
    {
      id: "1",
      loiDeFrais: "Loi A",
      marche: "Marché Principal",
      libelle: "Commission Standard",
      code: "CS001",
      commissionType: "percentage",
      commissionValue: 2.5,
      tva: 19,
      irgType1: 15,
      irgType2: 10,
      tiers: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      loiDeFrais: "Loi B",
      marche: "Marché Secondaire",
      libelle: "Commission Premium",
      code: "CP002",
      commissionType: "fixed",
      commissionValue: 5000,
      tva: 19,
      irgType1: 20,
      irgType2: 15,
      tiers: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      loiDeFrais: "Loi C",
      marche: "Marché International",
      libelle: "Commission Tiered",
      code: "CT003",
      commissionType: "tiered",
      commissionValue: 0,
      tva: 19,
      irgType1: 10,
      irgType2: 5,
      tiers: [
        { minAmount: 0, maxAmount: 10000, value: 20 },
        { minAmount: 10001, maxAmount: 100000, value: 15 },
        { minAmount: 100001, maxAmount: null, value: 5 },
      ],
      createdAt: new Date().toISOString(),
    },
  ]);
  const [editingCommission, setEditingCommission] = useState<Commission | null>(
    null
  );

  const handleAddNew = () => {
    setEditingCommission(null);
    setActiveTab("form");
  };

  const handleEdit = (commission: Commission) => {
    setEditingCommission(commission);
    setActiveTab("form");
  };

  const handleDelete = (id: string) => {
    setCommissions(commissions.filter((commission) => commission.id !== id));
  };

  const handleSave = (commission: Commission) => {
    if (editingCommission) {
      // Update existing commission
      setCommissions(
        commissions.map((c) => (c.id === commission.id ? commission : c))
      );
    } else {
      // Add new commission
      const newCommission = {
        ...commission,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      };
      setCommissions([...commissions, newCommission]);
    }
    setActiveTab("list");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">Commission List</TabsTrigger>
          <TabsTrigger value="form">
            {editingCommission ? "Edit Commission" : "New Commission"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <CommissionList
            commissions={commissions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="form">
          <CommissionForm
            commission={editingCommission}
            onSave={handleSave}
            onCancel={() => setActiveTab("list")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
