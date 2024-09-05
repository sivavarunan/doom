"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/componenets/ui/Sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconWorld,
} from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/componenets/logo";
import { LogoIcon } from "@/app/componenets/LogoIcon";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <Settings />
        </div>
      </div>
    </div>
  );


}

const Settings = () => {
  return (
    // <div className="flex flex-col w-full h-auto bg-neutral-50 dark:bg-gradient-to-b from-emerald-950 to-neutral-950 p-6">
    <div className="flex flex-col p-4 md:p-6 rounded-tl-2xl border-2 border-neutral-900 dark:border-neutral-900  w-full h-auto">

      <SettingsSection title="Account Settings" description="Manage your account details">
        <SettingItem label="Change Email" description="Update your email address" />
        <SettingItem label="Change Password" description="Update your account password" />
      </SettingsSection>


      <SettingsSection title="Privacy Settings" description="Control your privacy options">
        <SettingItem label="Two-Factor Authentication" description="Enable or disable 2FA" toggle />
        <SettingItem label="Manage Sessions" description="View and manage your active sessions" />
      </SettingsSection>

      <SettingsSection title="Notification Settings" description="Customize your notifications">
        <SettingItem label="Email Notifications" description="Receive notifications via email" toggle />
        <SettingItem label="Push Notifications" description="Receive notifications on your device" toggle />
      </SettingsSection>


      <SettingsSection title="General Settings" description="General app preferences">
        <SettingItem label="Dark Mode" description="Enable dark theme" toggle />
        <SettingItem label="Language" description="Select your preferred language" />
      </SettingsSection>
    </div>
    // </div>
  );
};


const SettingsSection = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

const SettingItem = ({ label, description, toggle }: { label: string; description: string; toggle?: boolean }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-center bg-white dark:bg-neutral-950 dark:bg-opacity-50 p-4 rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col justify-center">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">{label}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {toggle && (
        <label className="relative flex items-center ml-4 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isToggled}
            onChange={handleToggle}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 dark:bg-opacity-50 peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
        </label>
      )}
    </div>
  );
};

