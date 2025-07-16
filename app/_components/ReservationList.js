"use client";

import React, { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteReservation } from "../_lib/actions";

export default function ReservationList({ bookings }) {
  // useOptimistic hook provides optimistic UI updates - shows changes immediately before server confirms
  // First parameter: current state (bookings array)
  // Second parameter: reducer function that handles the optimistic update
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    // Reducer function: takes current bookings and the bookingId to delete
    (currentBookings, bookingId) => {
      // Filter out the booking with the matching ID, returning new array without it
      return currentBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  // Async function to handle the delete operation with optimistic updates
  async function handleDelete(bookingId) {
    // Immediately update UI optimistically (before server response)
    optimisticDelete(bookingId);
    // Actually delete the reservation from the server/database
    await deleteReservation(bookingId);
  }
  return (
    // Container for the list of reservations with vertical spacing
    <ul className="space-y-6">
      {/* Map over the optimistic bookings array to render each reservation */}
      {optimisticBookings.map((booking) => (
        // Render individual reservation card component
        // Pass the booking data, unique key for React, and delete handler function
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
