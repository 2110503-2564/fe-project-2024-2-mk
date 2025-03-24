// "use client";

// import { useEffect, useState } from "react";
// import getReservations from "@/libs/getReservations";
// import dayjs from "dayjs";

// import type { Dayjs } from "dayjs";

// import utc from 'dayjs/plugin/utc';

// dayjs.extend(utc);

// type Reservation = {
//   _id: string;
//   coworkingspace: string | { _id: string; name: string };
//   user: string | { _id: string };
//   nameLastname?: string;
//   tel?: string;
//   room_number: number;
//   startTime: string;
//   endTime: string;
// };

// export default function BookingList() {
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [loading, setLoading] = useState(true);

//   const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
//   const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;


//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [newStart, setNewStart] = useState<Dayjs | null>(null);
//   const [newEnd, setNewEnd] = useState<Dayjs | null>(null);


//   useEffect(() => {
//     const fetchReservations = async () => {
//       try {
//         const data = await getReservations();
//         const allReservations = data.data;

//         if (Array.isArray(allReservations)) {
//           if (role === "admin") {
//             setReservations(allReservations);
//           } else if (userId) {
//             const myBookings = allReservations.filter((r) => {
//               const bookingUserId = typeof r.user === "string" ? r.user : r.user?._id;
//               return bookingUserId === userId;
//             });
//             setReservations(myBookings);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to load reservations:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReservations();
//   }, [userId, role]);

//   const handleDelete = async (id: string) => {
//     const confirmDelete = confirm("Are you sure you want to delete this booking?");
//     if (!confirmDelete) return;

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`https://project-backend-co-working-space.vercel.app/api/v1/reservations/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         setReservations((prev) => prev.filter((r) => r._id !== id));
//         alert("Booking deleted successfully!");
//       } else {
//         const data = await res.json();
//         alert(data.message || "Failed to delete booking.");
//       }
//     } catch (err) {
//       console.error("Error deleting booking:", err);
//       alert("Error deleting booking.");
//     }
//   };

//   const handleEdit = async (id: string) => {
//     if (!newStart || !newEnd) {
//       alert("Please select start and end time");
//       return;
//     }
  
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`https://project-backend-co-working-space.vercel.app/api/v1/reservations/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           startTime: dayjs(newStart).toISOString(),
//           endTime: dayjs(newEnd).toISOString(),
//         }),
//       });
  
//       const data = await res.json();
  
//       if (res.ok) {
//         alert("Reservation updated!");
//         setEditingId(null);
//         setReservations((prev) =>
//           prev.map((r) => (r._id === id ? { ...r, startTime: newStart.toISOString(), endTime: newEnd.toISOString() } : r))
//         );
//       } else {
//         alert(data.message || "Update failed.");
//       }
//     } catch (err) {
//       console.error("Error updating booking:", err);
//       alert("Error updating booking.");
//     }
//   };
  

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6 text-sky-800">My Bookings</h2>

//       {role === "admin" && (
//         <p className="text-sm text-green-600 font-medium mb-4">
//           👑 You are viewing all reservations as an admin.
//         </p>
//       )}

//       {loading ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : reservations.length === 0 ? (
//         <p className="text-center text-gray-500">You have no bookings.</p>
//       ) : (
//         <div className="space-y-4">
//           {reservations.map((item) => {
//             const bookingUserId = typeof item.user === "string" ? item.user : item.user?._id;
//             const canEditOrDelete = role === "admin" || bookingUserId === userId;

//             return (
//               <div key={item._id} className="bg-white border border-gray-200 rounded-lg shadow p-4">
//                 <div className="text-lg font-semibold text-sky-700 mb-1">
//                   {typeof item.coworkingspace === "string"
//                     ? item.coworkingspace
//                     : item.coworkingspace.name}
//                 </div>
//                 <p className="text-sm text-gray-700">Room: {item.room_number}</p>
//                 {/* <p className="text-sm text-gray-700">Start: {dayjs.utc(item.startTime).format("MMMM D, YYYY h:mm A")}</p>
//                 <p className="text-sm text-gray-700">End: {dayjs.utc(item.endTime).format("MMMM D, YYYY h:mm A")}</p> */}
//                 <p className="text-sm text-gray-700">
//                   Start: {dayjs(item.startTime).local().format("MMMM D, YYYY h:mm A")}
//                 </p>
//                 <p className="text-sm text-gray-700">
//                   End: {dayjs(item.endTime).local().format("MMMM D, YYYY h:mm A")}
//                 </p>

//                 {item.nameLastname && <p className="text-sm text-gray-700">Name: {item.nameLastname}</p>}
//                 {item.tel && <p className="text-sm text-gray-700">Phone: {item.tel}</p>}

//                 {/* ปุ่ม Edit / Delete */}
                
//                 {canEditOrDelete && (
//                   <div className="mt-4 flex gap-3">
//                     {/* ปุ่ม Edit (future feature) */}
//                     <button
//                       className="px-4 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
//                       onClick={() => alert("Coming soon!")}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
//                       onClick={() => handleDelete(item._id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import getReservations from "@/libs/getReservations";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStart, setNewStart] = useState<Dayjs | null>(null);
  const [newEnd, setNewEnd] = useState<Dayjs | null>(null);

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

  const handleEdit = async (id: string) => {
    if (!newStart || !newEnd) {
      alert("Please select start and end time");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://project-backend-co-working-space.vercel.app/api/v1/reservations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startTime: newStart.toISOString(),
          endTime: newEnd.toISOString(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Reservation updated!");
        setEditingId(null);
        setReservations((prev) =>
          prev.map((r) =>
            r._id === id
              ? { ...r, startTime: newStart.toISOString(), endTime: newEnd.toISOString() }
              : r
          )
        );
      } else {
        alert(data.message || "Update failed.");
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Error updating booking.");
    }
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
                <p className="text-sm text-gray-700">
                  Start: {dayjs(item.startTime).local().format("MMMM D, YYYY h:mm A")}
                </p>
                <p className="text-sm text-gray-700">
                  End: {dayjs(item.endTime).local().format("MMMM D, YYYY h:mm A")}
                </p>
                {item.nameLastname && <p className="text-sm text-gray-700">Name: {item.nameLastname}</p>}
                {item.tel && <p className="text-sm text-gray-700">Phone: {item.tel}</p>}
                {canEditOrDelete && editingId === item._id ? (
                    <div className="mt-4 w-full bg-gray-50 p-4 rounded-lg shadow-inner space-y-4">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <DateTimePicker
                            label="New Start Time"
                            value={newStart}
                            onChange={setNewStart}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                          <DateTimePicker
                            label="New End Time"
                            value={newEnd}
                            onChange={setNewEnd}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </div>
                      </LocalizationProvider>

                      <div className="flex justify-end">
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                          onClick={() => handleEdit(item._id)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex gap-3">
                      <button
                        className="px-4 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                        onClick={() => {
                          setEditingId(item._id);
                          setNewStart(dayjs(item.startTime));
                          setNewEnd(dayjs(item.endTime));
                        }}
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
