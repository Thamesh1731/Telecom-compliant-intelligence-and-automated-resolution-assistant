"use client";
import { useEffect, useRef, useState } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  animationPath?: string;
  animationData?: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieAnimation({
  animationPath,
  animationData: directData,
  className = "w-full h-full",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [data, setData] = useState<any>(directData || null);

  useEffect(() => {
    if (!directData && animationPath) {
      fetch(animationPath)
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error("Error loading animation:", err));
    }
  }, [animationPath, directData]);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    if (animRef.current) {
      animRef.current.destroy();
    }

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: loop,
      autoplay: autoplay,
      animationData: data,
    });

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [data, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      className={`${className} flex items-center justify-center`}
    />
  );
}
