'use client'
import React from "react";
import { BackgroundBeamsWithCollision } from "@/app/componenets/ui/background-beams-with-collision";
import { useRouter } from 'next/navigation';

export function Indexpage() {
    const router = useRouter(); 

    const handleClick = () => {
        router.push('/pages/MainPage'); 
    };

    return (
        <BackgroundBeamsWithCollision>
            <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                Welcome to {" "}
                <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                    <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 ffrom-green-400 via-emerald-600 to-teal-700 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                        <span className="">DOOM.</span>
                    </div>
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-green-400 via-emerald-600 to-teal-700 py-4">
                        <span className="">DOOM.</span>
                    </div>
                </div>
                <div>
                    <button  
                        onClick={handleClick}
                        className="bg-neutral-800 font-sans text-3xl px-4 py-3 rounded-full hover:text-emerald-400 hover:bg-cyan-100">
                        Get Started 
                    </button>
                </div>
            </h2>
        </BackgroundBeamsWithCollision>
    );
}
