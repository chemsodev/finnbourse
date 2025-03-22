"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";

interface PdfDialogProps {
  children: React.ReactNode;
  fileKey: string; // Prop for the PDF URL
}

const PdfDialog = ({ children, fileKey }: PdfDialogProps) => {
  const { data: session } = useSession();
  const authToken = session?.user?.token || "";

  const fetchFile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/file-manager/download/${fileKey}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }
      const contentDisposition = response.headers.get("content-disposition");

      let fileName = "download";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        fileName = contentDisposition
          .split("filename=")[1]
          .split(";")[0]
          .replace(/['"]/g, "");
      }
      // Convert the response to a Blob
      const blob = await response.blob();

      const fileType = fileName.split(".").pop()?.toLowerCase() || "";

      if (fileType === "pdf") {
        // If it's a PDF
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open the URL in a new tab
        const newWindow = window.open(
          "",
          "_blank",
          "width=800,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=no"
        );
        if (newWindow) {
          newWindow.location = pdfUrl; // Set the location to the PDF URL
        } else {
          console.error("Failed to open new window");
        }
      } else if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
        // If it's an image
        const imgblob = new Blob([blob], {
          type: `image/${fileType}`,
        });
        const imgUrl = URL.createObjectURL(imgblob);

        // Open the URL in a new tab
        const newWindow = window.open(
          "",
          "_blank",
          "width=800,height=800,toolbar=no,menubar=no,scrollbars=yes,resizable=no"
        );
        if (newWindow) {
          newWindow.location = imgUrl;
        } else {
          console.error("Failed to open new window");
        }
      } else {
        console.warn("Unsupported file type:", fileType);
      }
    } catch (error) {
      console.error("Error fetching the file:", error);
    }
  };
  return (
    <button
      onClick={() => fetchFile()}
      className={`text-left ${
        !fileKey ? "cursor-not-allowed text-gray-300" : ""
      }`}
      disabled={!fileKey}
    >
      {children}
    </button>
  );
};

export default PdfDialog;
