"use client";

import { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import getCoworkingspaces from "@/libs/getCoworkingspaces";
import { useSearchParams } from "next/navigation";
import useBookingStore from "@/stores/useBookingStore";
import useAuthStore from "@/stores/useAuthStore";


// Type
type Coworking = {
  _id: string;
  name: string;
  address?: string;
  telephone_number?: string;
  openTime?: string;
  closeTime?: string;
};

export default function DateReserve() {
  const searchParams = useSearchParams();
  const modelFromURL = searchParams.get("model");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [coworkingspace, setCoworkingspace] = useState("");
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [roomNumber, setRoomNumber] = useState<number>(0);
  const [coworkingspaceList, setCoworkingspaceList] = useState<Coworking[]>([]);
  const [loading, setLoading] = useState(true);
  const { addBooking } = useBookingStore();
  const { userId, token } = useAuthStore();

  const formatToLocalISOString = (date: Dayjs | null) => {
    return date ? dayjs(date).format("YYYY-MM-DDTHH:mm:ss") : null;
  };
  
  
  
  
  const selectedBranch = coworkingspaceList.find(
    (branch) => branch.name === coworkingspace
  );

  useEffect(() => {
    const fetchCoworkingspaces = async () => {
      try {
        const res = await getCoworkingspaces();
        if (Array.isArray(res.data)) {
          setCoworkingspaceList(res.data);
          if (modelFromURL) {
            const match = res.data.find(
              (branch: Coworking) =>
                branch.name.toLowerCase() === modelFromURL.toLowerCase()
            );
            if (match) {
              setCoworkingspace(match.name);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching coworkingspaces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoworkingspaces();
  }, [modelFromURL]);

  const makeReservation = async () => {
    if (
      name &&
      tel &&
      coworkingspace &&
      startTime &&
      endTime &&
      roomNumber &&
      selectedBranch
    ) {
      if (!userId || !token) {
        alert("You must be logged in to make a reservation.");
        return;
      }

      const reservation = {
        user: userId,
        coworkingspace: selectedBranch._id,
        startTime: formatToLocalISOString(startTime),
        endTime: formatToLocalISOString(endTime),
        room_number: roomNumber,
      };
      

      try {
        console.log("Reservation data:", reservation);
        const res = await fetch(
          "https://project-backend-co-working-space.vercel.app/api/v1/reservations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reservation),
          }
        );

        const data = await res.json();

        if (res.ok) {
          alert("Your booking has been submitted!");
          addBooking({
            nameLastname: name,
            tel,
            coworkingspace,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            room_number: roomNumber,
          });
        } else {
          console.error("Reservation error:", data);
          alert(data.message || "This room is already booked at that time.");
        }
      } catch (err) {
        console.error("Failed to create reservation:", err);
        alert("Failed to create reservation.");
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl flex flex-wrap gap-6 justify-center">
      <TextField
        fullWidth
        label="Full Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        fullWidth
        label="Phone Number"
        variant="outlined"
        value={tel}
        onChange={(e) => setTel(e.target.value)}
      />

      <FormControl fullWidth>
        <InputLabel id="coworkingspace-label">Coworking Branch</InputLabel>
        <Select
          labelId="coworkingspace-label"
          value={coworkingspace}
          onChange={(e) => setCoworkingspace(e.target.value)}
          label="Coworking Branch"
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={20} /> Loading...
            </MenuItem>
          ) : coworkingspaceList.length > 0 ? (
            coworkingspaceList.map((branch: Coworking) => (
              <MenuItem key={branch._id} value={branch.name}>
                {branch.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No branches available</MenuItem>
          )}
        </Select>
      </FormControl>

      {selectedBranch && (
        <div className="w-full bg-gradient-to-r from-cyan-50 to-white border border-cyan-100 rounded-xl p-4 shadow-inner space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-sky-800">📍 Address:</span>{" "}
            {selectedBranch.address || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-sky-800">📞 Phone:</span>{" "}
            {selectedBranch.telephone_number || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-sky-800">🕒 Open:</span>{" "}
            {selectedBranch.openTime || "?"} - {selectedBranch.closeTime || "?"}
          </p>
        </div>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Start Date & Time"
          value={startTime}
          onChange={(newDate) => setStartTime(newDate)}
        />
        <DateTimePicker
          label="End Date & Time"
          value={endTime}
          onChange={(newDate) => setEndTime(newDate)}
        />
      </LocalizationProvider>

      <TextField
        fullWidth
        label="Room Number"
        variant="outlined"
        type="number"
        value={roomNumber}
        onChange={(e) => setRoomNumber(parseInt(e.target.value))}
      />

      <div className="w-full flex justify-center">
        <button
          className="bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700 transition"
          onClick={makeReservation}
        >
          Book Room
        </button>
      </div>
    </div>
  );
}
