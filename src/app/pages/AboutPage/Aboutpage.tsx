"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandX,
  IconWorld
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function SidebarComp() {
  const links = [
    {
      label: "Dashboard",
      href: "/pages/MainPage",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 " />
      ),
    },
    {
      label: "Profile",
      href: "/pages/Profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Community",
      href: "/pages/CommunityPage",
      icon: (
        <IconWorld className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/pages/Settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/pages/LoginPage",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-gradient-to-t from-neutral-800 to-neutral-900 w-full h-screen overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} >

        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden ">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          <div>
            <SidebarLink
              link={{
                label: "About",
                href: "/pages/AboutPage",
                icon: (
                  <Image
                    src="/anime.jpg"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 overflow-y-scroll custom-scrollbar">
        <div className="flex-1 overflow-auto">
          <About />
        </div>
      </div>

    </div>

  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        DOOM
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// About component
const About = () => {
  return (
    <div className="flex flex-col p-4 md:p-10 w-full h-full">
      {/* Hero Section */}
      <div className="relative w-full h-52 rounded-lg mb-10">
        <div className="absolute inset-0 bg-gray-300 dark:bg-neutral-800 animate-pulse "></div>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-sm">
          <h1 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-green-400 via-emerald-600 to-teal-700 text-5xl md:text-6xl mt-6 font-bold">
            About Me
          </h1>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 bg-black bg-opacity-30 p-10 rounded-md">
        <div className="flex flex-col gap-4 mb-10 md:flex-1">
          <h2 className="text-2xl md:text-4xl font-bold bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-6 from-green-400 via-emerald-600 to-teal-700">
            My Mission
          </h2>
          <p className="text-base text-neutral-700 dark:text-neutral-300">
            My mission is to build a robust Next.js web application, integrated with Firebase for secure authentication and real-time database management, and hosted on Vercel for optimal performance. This app will function as a seamless and interactive chatting platform, ensuring users can communicate effortlessly in a secure environment.
          </p>
        </div>

        {/* Values Section */}
        <div className="flex flex-col md:flex-1 gap-4">
          {[
            {
              title: "Security",
              description:
                "Prioritizing user data protection through Firebase's reliable authentication and database solutions.",
            },
            {
              title: "Performance",
              description:
                "Ensuring fast and efficient communication by hosting on Vercel for optimal app responsiveness.",
            },
            {
              title: "User Experience",
              description:
                "Delivering a smooth and intuitive chatting interface that fosters effortless and enjoyable communication.",
            },
          ].map((value, i) => (
            <div key={"values-section" + i} className="flex-1 flex flex-col gap-2">
              <h3 className="text-xl md:text-2xl bg-clip-text bg-no-repeat font-semibold text-transparent bg-gradient-to-r py-6 from-green-400 via-emerald-600 to-teal-700">
                {value.title}
              </h3>
              <p className="text-base text-neutral-700 dark:text-neutral-300">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/*Contact Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 bg-black bg-opacity-35 p-10 rounded-md">
        {/* Image and Name */}
        <div className="flex flex-col items-center w-full md:w-1/2 lg:w-1/3">
          <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden mb-4">
            <Image
              src="/myphoto.jpg"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              alt="Avatar"
            />

          </div>
          <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-200">
            T.Sivavarunan
          </h3>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">
            Software Engineering Under Graduate
          </p>
        </div>

        {/* Contact Info and Social Media */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-6 from-green-400 via-emerald-600 to-teal-700 text-4xl md:text-4xl font-bold">
            Get in Touch
          </h2>
          <div className="flex flex-col gap-2 text-base text-neutral-700 dark:text-neutral-300">
            <div>Email: <a href="mailto:Tharagan2001@gmail.com" className="text-emerald-500">Tharagan2001@gmail.com</a></div>
            <div>Phone: +94 768359459</div>
            <div>Address: 12th, 36th lane, Colombo 6, Sri Lanka</div>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400">
              <IconBrandFacebook className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-400 dark:hover:text-blue-300">
              <IconBrandX className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-700 dark:hover:text-blue-500">
              <IconBrandLinkedin className="h-6 w-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-200 hover:text-pink-600 dark:hover:text-pink-400">
              <IconBrandInstagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

