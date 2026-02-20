"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PlaneAnimation() {
    const planeRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const plane = planeRef.current;

        if (!plane) return;

        gsap.set(plane, {
            x: -200,
            y: 150,
            scale: 0.6,
            rotate: 10,
            opacity: 0,
        });

        gsap.to(plane, {
            duration: 18,
            x: window.innerWidth + 200,
            y: -100,
            rotate: -8,
            opacity: 1,
            ease: "power1.inOut",
            repeat: -1,
            delay: 1,
        });
    }, []);

    return (
        <img
            ref={planeRef}
            src="/plane.svg"
            alt="avião"
            className="pointer-events-none absolute z-20 w-24 md:w-32 opacity-80 mix-blend-overlay"
            style={{ top: "30%" }}
        />
    );
}
