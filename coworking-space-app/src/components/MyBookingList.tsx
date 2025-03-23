"use client";

import { useEffect, useState } from "react";
import getReservations from "@/libs/getReservations";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

type Reservation = {
  _id: string;
  coworkingspace: string | { _id: string; name: string };
  user: string | { _id: string };
  nameLastname?: string;
  tel?: string;
  room_number: number;
  startTime: string;
  endTime: string;
};

export default function BookingList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getReservations();
        const allReservations = data.data;

        if (Array.isArray(allReservations)) {
          if (role === "admin") {
            setReservations(allReservations);
          } else if (userId) {
            const myBookings = allReservations.filter((r) => {
              const bookingUserId = typeof r.user === "string" ? r.user : r.user?._id;
              return bookingUserId === userId;
            });
            setReservations(myBookings);
          }
        }
      } catch (error) {
        console.error("Failed to load reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId, role]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://project-backend-co-working-space.vercel.app/api/v1/reservations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r._id !== id));
        alert("Booking deleted successfully!");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete booking.");
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Error deleting booking.");
    }
  };

  const handleEdit = (id: string) => {
    

  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-sky-800">My Bookings</h2>

      {role === "admin" && (
        <p className="text-sm text-green-600 font-medium mb-4">
          👑 You are viewing all reservations as an admin.
        </p>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : reservations.length === 0 ? (
        <p className="text-center text-gray-500">You have no bookings.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((item) => {
            const bookingUserId = typeof item.user === "string" ? item.user : item.user?._id;
            const canEditOrDelete = role === "admin" || bookingUserId === userId;

            return (
              <div key={item._id} className="bg-white border border-gray-200 rounded-lg shadow p-4">
                <div className="text-lg font-semibold text-sky-700 mb-1">
                  {typeof item.coworkingspace === "string"
                    ? item.coworkingspace
                    : item.coworkingspace.name}
                </div>
                <p className="text-sm text-gray-700">Room: {item.room_number}</p>
                <p className="text-sm text-gray-700">Start: {dayjs.utc(item.startTime).format("MMMM D, YYYY h:mm A")}</p>
                <p className="text-sm text-gray-700">End: {dayjs.utc(item.endTime).format("MMMM D, YYYY h:mm A")}</p>
                {item.nameLastname && <p className="text-sm text-gray-700">Name: {item.nameLastname}</p>}
                {item.tel && <p className="text-sm text-gray-700">Phone: {item.tel}</p>}

                {/* ปุ่ม Edit / Delete */}
                {canEditOrDelete && (
                  <div className="mt-4 flex gap-3">
                    {/* ปุ่ม Edit (future feature) */}
                    <button
                      className="px-4 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                      onClick={() => handleEdit(item._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
