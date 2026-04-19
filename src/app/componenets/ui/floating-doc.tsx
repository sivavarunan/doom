/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

type FloatingDockItem = {
  title: string;
  icon: React.ReactNode;
  href?: string; 
  onClick?: () => void; 
};

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
          >
            {items.map((item, idx) => {
              const commonMotionProps = {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: {
                  opacity: 0,
                  y: 10,
                  transition: { delay: idx * 0.05 },
                },
                transition: { delay: (items.length - 1 - idx) * 0.05 },
              };

              return (
                <motion.div key={item.title} {...commonMotionProps}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      key={item.title}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-surface-2/80 text-white/70 backdrop-blur-xl transition-colors hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                    >
                      <div className="h-4 w-4">{item.icon}</div>
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-surface-2/80 text-white/70 backdrop-blur-xl transition-colors hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                    >
                      <div className="h-4 w-4">{item.icon}</div>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-surface-2/80 text-white/70 backdrop-blur-xl transition-colors hover:text-emerald-300"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-3 rounded-2xl border border-white/[0.06] bg-surface-1/60 px-4 pb-3 backdrop-blur-xl md:flex",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer
          key={item.title}
          mouseX={mouseX}
          {...item}
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const commonContent = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-full border border-white/[0.06] bg-surface-2/80 text-white/70 transition-colors hover:border-emerald-400/30 hover:bg-emerald-500/15 hover:text-emerald-300"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-9 left-1/2 w-fit -translate-x-1/2 whitespace-pre rounded-md border border-white/[0.08] bg-surface-3/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/80 backdrop-blur-xl"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>
    </motion.div>
  );

  return href ? (
    <Link href={href} passHref>
      {commonContent}
    </Link>
  ) : (
    <button onClick={onClick}>{commonContent}</button>
  );
}