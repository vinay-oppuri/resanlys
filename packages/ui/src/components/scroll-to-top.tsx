"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./button";

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <div
            className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                }`}
        >
            <Button
                onClick={scrollToTop}
                size="icon"
                className="
                    rounded-full w-12 h-12
                    bg-background/80 backdrop-blur-md 
                    border border-foreground/10
                    text-foreground 
                    hover:scale-110 hover:shadow-xl hover:bg-background
                    transition-all duration-300
                    group
                "
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
            </Button>
        </div>
    );
};