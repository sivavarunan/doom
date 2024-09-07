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

export function FloatingDockComp({ className = "" }: { className?: string }) {
  // State to track if FileUpload is visible
  const [isFileUploadVisible, setFileUploadVisible] = useState(false);

  // Function to handle the "File" icon click
  const handleFileClick = () => {
    setFileUploadVisible(true);
  };

  // List of dock items
  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "Products",
      icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "Components",
      icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "DOOM",
      icon: <Image src="/doom1.png" width={500} height={200} alt="Aceternity Logo" />,
      href: "#",
    },
    {
      title: "File",
      icon: <IconFile className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: handleFileClick,
    },
    {
      title: "Twitter",
      icon: <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
  ];


  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FloatingDock items={links} />

      {/* Popup FileUpload component */}
      {isFileUploadVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setFileUploadVisible(false)} // Hide popup on outside click
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent click inside the popup from closing it
          >
            <FileUpload onChange={(files) => console.log(files)} />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setFileUploadVisible(false)} // Close button for the popup
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
