import React from "react";
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

export function FloatingDockComp({ className = '' }: { className?: string }) {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "DOOM",
      icon: (
        <Image
          src="/doom1.png"
          width={500}
          height={200}
          alt="Aceternity Logo"
        />
      ),
      href: "#",
    },
    {
      title: "File",
      icon: (
        <IconFile className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FloatingDock
        items={links}
      />
    </div>
  );
}
