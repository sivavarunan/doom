import React, { useState } from "react";
import { FloatingDock } from "./floating-doc";
import {
  IconBrandGithub,
  IconBrandX,
  IconHome,
  IconNewSection,
  IconTerminal2,
  IconFile,
} from "@tabler/icons-react";
import Image from "next/image";
import { FileUpload } from "@/app/componenets/ui/file-upload";

export function FloatingDockComp({
  className = "",
  onSendFileToChat,
}: {
  className?: string;
  onSendFileToChat?: (fileURLs: string[]) => void; // Add this prop
}) {
  const [isFileUploadVisible, setFileUploadVisible] = useState(false);

  const handleFileClick = () => {
    setFileUploadVisible(true);
  };

  const links = [
    { title: "Home", icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#" },
    { title: "Products", icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#" },
    { title: "Components", icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#" },
    { title: "DOOM", icon: <Image src="/doom1.png" width={500} height={200} alt="Aceternity Logo" />, href: "#" },
    { title: "File", icon: <IconFile className="h-full w-full text-neutral-500 dark:text-neutral-300" />, onClick: handleFileClick },
    { title: "Twitter", icon: <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#" },
    { title: "GitHub", icon: <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#" },
  ];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FloatingDock items={links} />

      {/* Popup FileUpload component */}
      {isFileUploadVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setFileUploadVisible(false)}
        >
          <div
            className="bg-neutral-950 bg-opacity-35 p-2 rounded-3xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <FileUpload
              onChange={(files) => {
                onSendFileToChat?.(files); // Send the uploaded files to the chat component
                setFileUploadVisible(false);
              }}
            />
            <button
              className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-950 rounded-3xl"
              onClick={() => setFileUploadVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
