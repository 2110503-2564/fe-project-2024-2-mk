"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopMenuItem from "./TopMenuItem";
import Link from "next/link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function TopMenu() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // ใช้ null ตอนโหลด

  // ✅ ตรวจ token หลังโหลดหน้าเสร็จ
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleSignOut = () => {
    if (!isLoggedIn) return; // ✅ ป้องกันกรณีไม่ได้ login

    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    alert("Signed out successfully.");
    router.push("/signin");
  };

  return (
    <div className="h-[64px] bg-gradient-to-r from-sky-100 to-white fixed top-0 left-0 right-0 z-30 border-b border-sky-200 shadow-md px-6 flex items-center justify-between font-sans">
      {/* Logo */}
      <div className="text-3xl font-bold text-sky-700 hover:text-sky-900 transition cursor-pointer tracking-wide">
        <Link href="/">Mk</Link>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 items-center text-base font-semibold text-sky-800">
        <TopMenuItem title="Coworking" pageRef="/coworkingspace" />
        <TopMenuItem title="Reservations" pageRef="/reservations" />
        <TopMenuItem title="My Booking" pageRef="/mybooking" />
        <TopMenuItem title="Contact" pageRef="/contact" />
        <TopMenuItem title="About" pageRef="/about" />
      </div>

      {/* Sign In / Sign Out */}
      <div>
        {isLoggedIn === null ? null : isLoggedIn ? (
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="cursor-pointer"
          >
            <AccountCircleIcon
              fontSize="large"
              className="text-sky-600 hover:text-sky-800 transition"
            />
          </button>
        ) : (
          <Link href="/signin" title="Sign In">
            <AccountCircleIcon
              fontSize="large"
              className="text-sky-600 hover:text-sky-800 transition cursor-pointer"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
