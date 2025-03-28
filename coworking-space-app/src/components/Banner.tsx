"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/stores/useAuthStore";
import useHydrated from "@/stores/useHydrated";

export default function Banner() {
  const covers = ["/img/cover.jpg", "/img/cover2.jpg", "/img/cover3.jpg"];
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const hydrated = useHydrated();

  return (
    <div
      className="relative w-screen h-[calc(100vh-60px)] overflow-hidden"
      onClick={() => setIndex((prev) => prev + 1)}
    >
      {/* Background Image */}
      <Image
        src={covers[index % covers.length]}
        alt="cover"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white bg-black/30">
        <h1 className="text-4xl font-bold drop-shadow-lg">
          Find Your Perfect Workspace
        </h1>
        <h3 className="text-xl font-serif mt-2 drop-shadow-md">
          Book your coworking space with ease & flexibility
        </h3>

        {/* ✅ Render หลัง Hydration */}
        {hydrated && !isLoggedIn && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/signin");
              }}
              className="bg-white text-cyan-600 font-semibold px-4 py-2 rounded hover:bg-cyan-600 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/register");
              }}
              className="bg-white text-cyan-600 font-semibold px-4 py-2 rounded hover:bg-cyan-600 hover:text-white transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
