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
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/componenets/logo";
import { LogoIcon } from "@/app/componenets/LogoIcon";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SidebarComp() {

  const clearIndexedDB = async () => {
    const databases = [
      '/firebaseLocalStorageDb',
      'firebaselocalstorage',
    ];

    // Delete known databases
    databases.forEach((dbName) => {
      if (dbName) {
        const request = indexedDB.deleteDatabase(dbName);
        request.onsuccess = () => {
          console.log(`IndexedDB ${dbName} cleared`);
        };
        request.onerror = (event) => {
          console.error(`Error clearing IndexedDB ${dbName}:`, event);
        };
      }
    });

    // List and delete all databases
    try {
      const dbs = await indexedDB.databases();
      dbs.forEach((dbInfo) => {
        const dbName = dbInfo.name;
        if (dbName) {
          const request = indexedDB.deleteDatabase(dbName);
          request.onsuccess = () => {
            console.log(`IndexedDB ${dbName} cleared`);
          };
          request.onerror = (event) => {
            console.error(`Error clearing IndexedDB ${dbName}:`, event);
          };
        }
      });
    } catch (error) {
      console.error('Error listing databases:', error);
    }
  };

  const handleLogout = async () => {
    // Remove auth token
    localStorage.removeItem('authToken');

    // Clear IndexedDB
    await clearIndexedDB();

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Notify user
    toast.success("Signed out successfully", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    });

    // Redirect to Login page
    window.location.href = '/pages/LoginPage'; // Immediate redirection
  };

  const links = [
    {
      label: "Dashboard",
      href: "/pages/MainPage",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
      onClick: handleLogout,
    },
  ];

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-gradient-to-b from-emerald-950 to-neutral-950 w-full h-screen overflow-hidden"
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
      <div className="flex-1 overflow-y-scroll dark:custom-scrollbar">
        <div className="flex-1 overflow-auto">
          <About />
        </div>
      </div>
    </div>
  );
}

// About component
const About = () => {
  return (
    <div className="flex flex-col p-4 md:p-10 w-full h-full">
      {/* Hero Section */}
      <div className="relative w-full h-52 rounded-lg mb-10">
        <div className="absolute inset-0 bg-white dark:bg-neutral-950 animate-pulse "></div>
        <div className="absolute inset-0  dark:bg-inherit  bg-opacity-50 flex items-center justify-center rounded-sm">
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
            <a href="https://facebook.com/sivavarunan.siva" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400">
              <IconBrandFacebook className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-400 dark:hover:text-blue-300">
              <IconBrandX className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com/in/thevarasa-sivavarunan-0b587a266" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-200 hover:text-blue-700 dark:hover:text-blue-500">
              <IconBrandLinkedin className="h-6 w-6" />
            </a>
            <a href="https://instagram.com/sivavarunan" target="_blank" rel="noopener noreferrer" className="text-neutral-700 dark:text-neutral-200 hover:text-pink-600 dark:hover:text-pink-400">
              <IconBrandInstagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

