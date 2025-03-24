"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getUserProfile from "@/libs/getUserProfile"; 
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        const result = await getUserProfile(token);
        if (result.success) {
          setUser(result.data);
        } else {
          alert("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        router.push("/signin");
      }
    };

    fetchProfile();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("https://project-backend-co-working-space.vercel.app/api/v1/auth/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        alert("Signed out successfully.");
        router.push("/signin");
      } else {
        alert("Failed to sign out.");
      }
    } catch (err) {
      console.error("Error signing out:", err);
      alert("Error signing out.");
    }
  };

  if (!user) return <p className="p-6 text-gray-600">Loading profile...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-sky-800">My Profile</h2>
      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <AccountCircleIcon fontSize="large" className="text-sky-600 mr-3" />
          <div>
            <h3 className="text-xl font-semibold text-sky-700">
              {user.name || "No Name"}
            </h3>
            
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-1">Email: {user.email || "-"}</p>
        <p className="text-sm text-gray-700 mb-4">Phone: {user.telephone_number || "-"}</p>
       

        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
