'use client'

import React from 'react';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BackgroundBeamsWithCollision } from "@/app/componenets/ui/background-beams-with-collision";
import { useRouter } from 'next/navigation';
import { FlipWords } from "@/app/componenets/ui/flip-words";

export default function Home() {
    const router = useRouter();

    const handleClick = () => {
        toast.success("Redirecting to MainPage...", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Slide,
        });
        
        router.push('/pages/MainPage');
    };

    const words = ["get started", "click me", "try me", "come on"];

    return (
        <BackgroundBeamsWithCollision>
            <h2 className="relative z-20 md:text-7xl text-5xl font-bold text-center text-black dark:text-neutral-300 font-sans tracking-tight bottom-5 p-2">
                Welcome to {" "}
                <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                    <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-green-400 via-emerald-600 to-teal-700 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                        <span className="">DOOM <br /></span>
                    </div>
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-green-400 via-emerald-600 to-teal-700 py-4">
                        <span className="">DOOM <br /></span>
                    </div>
                </div>
                <div>
                    <button  
                        onClick={handleClick}
                        className="bg-gradient-to-br from-neutral-900 to-gray-950 border-2 border-opacity-80 border-gray-600 hover:border-teal-400 font-sans md:text-3xl rounded-full focus:border-teal-200 ">
                         <FlipWords className="hover:text-emerald-800 md:text-3xl md:px-3 md:py-2 bottom-3 md:bottom-0 font-mono tracking-wide ml-3 text-xl" words={words} />
                    </button>
                </div>
            </h2>
        </BackgroundBeamsWithCollision>
    );
}
