"use client";
import React from "react";
import { AppShell } from "@/app/componenets/AppShell";
import Chat from "./chatcomp";

export function SidebarComp() {
    return (
        <AppShell contentClassName="!overflow-hidden">
            <Chat />
        </AppShell>
    );
}
