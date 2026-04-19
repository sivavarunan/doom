"use client";
import React from "react";
import { AppShell } from "@/app/componenets/AppShell";
import Profile from "./profile";

export function SidebarComp() {
    return (
        <AppShell>
            <Profile />
        </AppShell>
    );
}
