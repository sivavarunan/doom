"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  onClick?: () => void;
  badge?: string | number;
  active?: boolean;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.aside
      className={cn(
        "relative hidden md:flex md:flex-col h-full flex-shrink-0 overflow-hidden",
        "border-r border-white/[0.06] bg-[rgb(var(--surface-0))]/80 backdrop-blur-xl",
        "px-3 py-5",
        className
      )}
      animate={{
        width: animate ? (open ? 264 : 72) : 264,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/[0.04] via-transparent to-transparent" />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.aside>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "flex h-14 items-center justify-between border-b border-white/[0.06] bg-[rgb(var(--surface-0))]/80 px-4 backdrop-blur-xl md:hidden"
      )}
      {...props}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/5 hover:text-white"
      >
        <IconMenu2 className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className={cn(
                "fixed inset-y-0 left-0 z-[100] flex w-[80%] max-w-[300px] flex-col gap-6 border-r border-white/[0.06] bg-[rgb(var(--surface-0))] p-6",
                className
              )}
            >
              <button
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <IconX className="h-5 w-5" />
              </button>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive =
    link.active ??
    (link.href !== "#" && pathname === link.href);

  return (
    <Link
      href={link.href}
      onClick={link.onClick}
      className={cn(
        "group/sidebar relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors duration-150",
        isActive
          ? "bg-emerald-500/10 text-white"
          : "text-white/65 hover:bg-white/[0.04] hover:text-white",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-300 to-emerald-500"
        />
      )}
      <span
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
          isActive
            ? "text-emerald-300"
            : "text-white/60 group-hover/sidebar:text-emerald-300"
        )}
      >
        {link.icon}
      </span>
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? "auto" : 0) : "auto",
        }}
        transition={{ duration: 0.18 }}
        className="overflow-hidden whitespace-nowrap"
      >
        {link.label}
      </motion.span>
      {link.badge !== undefined && open && (
        <span className="ml-auto inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono font-medium text-emerald-300">
          {link.badge}
        </span>
      )}
    </Link>
  );
};
