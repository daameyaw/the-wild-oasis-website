"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

// Updates the user's profile in the database with new nationality, country flag, and national ID.
// Accepts a FormData object containing the updated profile fields.
export async function updateProfile(formData) {
  // Log the incoming form data for debugging purposes.
  // console.log(formData);

  // Retrieve the current user session to ensure the user is authenticated.
  const session = await auth();
  // If there is no session, throw an error to prevent unauthenticated updates.
  if (!session) {
    throw new Error("You must be signed in to update your profile");
  }

  // Extract the nationalID value from the form data.
  const nationalID = formData.get("nationalID");
  // Extract nationality and countryFlag from the nationality field, which is expected to be in the format 'nationality%countryFlag'.
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  // Validate the nationalID to ensure it is 6-12 alphanumeric characters.
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error(
      "National ID must be 6-12 characters long and contain only letters and numbers"
    );
  }

  // Prepare the data object to be sent to the database for updating.
  const updateData = {
    nationality,
    countryFlag,
    nationalID,
  };

  // Update the 'guests' table in the database with the new data, filtering by the current user's guestId.
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  // If there is an error during the update, throw an error to notify the caller.
  if (error) {
    // console.error(error);
    throw new Error("Guest could not be updated");
  }

  // Optionally, log the update data for debugging (currently commented out).
  // console.log(updateData)

  /*
  The `revalidatePath("/account/profile");` line below is used to manually invalidate the cache for the `/account/profile` route.
  This ensures that the next time a user visits the profile page, Next.js will regenerate the page with the most up-to-date data from the database,
  rather than serving potentially stale, cached content.

  This is especially important after a profile update, because the user's information has changed and we want the UI to reflect those changes immediately.
  By calling `revalidatePath`, we trigger Incremental Static Regeneration (ISR) for that path, so the next visit will show the latest data.

  Note: This function does not return a value and only marks the path as stale; the actual regeneration happens on the next request to that path.
*/
  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId) {
  // Retrieve the current user session to ensure the user is authenticated.
  const session = await auth();
  // If there is no session, throw an error to prevent unauthenticated updates.
  if (!session) {
    throw new Error("You must be signed in to update your profile");
  }

  // Fetch all bookings for the current guest (user).
  const guestBookings = await getBookings(session.user.guestId);
  // Extract the IDs of all bookings belonging to the guest.
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  // Check if the bookingId to be deleted belongs to the current user.
  if (!guestBookingsIds.includes(bookingId)) {
    throw new Error("You can only delete your own bookings");
  }

  // Attempt to delete the booking from the 'bookings' table in the database.
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  // If there was an error during deletion, log it and throw an error.
  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  // Invalidate the cache for the reservations page so the UI updates to reflect the deletion.
  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  // very important to convert to Number
  const bookingId = Number(formData.get("bookingId"));

  //AUTHENTICATION

  // Retrieve the current user session to ensure the user is authenticated.
  const session = await auth();
  // If there is no session, throw an error to prevent unauthenticated updates.
  if (!session) {
    throw new Error("You must be signed in to update your profile");
  }

  //AUTHORIZATION
  // Fetch all bookings for the current guest (user).
  const guestBookings = await getBookings(session.user.guestId);
  // Extract the IDs of all bookings belonging to the guest.
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  // Check if the bookingId to be deleted belongs to the current user.
  if (!guestBookingsIds.includes(bookingId)) {
    throw new Error("You can only update your own bookings");
  }

  //BUILDING THE UPDATE DATA
  const updatedFields = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  //MUTATION
  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId)
    .select()
    .single();

  //ERROR HANDLING
  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  //REVALIDATION
  // Invalidate cache for reservations list page to show updated booking data
  revalidatePath("/account/reservations");
  // Invalidate cache for the specific edit page to ensure fresh data on next visit
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  //REDIRECT
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/account",
    //   callbackUrl: "/account",
  });
}
/**
 * Signs out the current user and redirects to the home page.
 *
 * @returns {Promise<void>} A promise that resolves when the sign-out process is complete.
 */
export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}
// Bind bookingData as the first argument to createBooking action
// This means when the form submits, bookingData will be passed as the first parameter
// and the form data will be passed as the second parameter

export async function createBooking(bookingData, formData) {
  const session = await auth();
  // If there is no session, throw an error to prevent unauthenticated updates.
  if (!session) {
    throw new Error("You must be signed in to update your profile");
  }

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extraPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  console.log(newBooking);

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}
