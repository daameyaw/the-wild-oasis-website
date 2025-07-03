"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import { deleteReservation } from "../_lib/actions";
import SpinnerMini from "./SpinnerMini";

function DeleteReservation({ bookingId }) {
  // function deleteReservation() {
  //   "use server";
  // }

  // useTransition is a React hook that allows you to mark certain state updates as non-urgent (transitions).
  // This is especially useful for async actions like deleting a reservation, which may take some time to complete.
  // By wrapping the deleteReservation call in startTransition, React can keep the UI responsive and show intermediate states (like loading spinners),
  // instead of blocking the UI or causing it to freeze during the async operation.
  // This improves user experience by allowing urgent updates (like button clicks or form input) to remain responsive,
  // while the less-urgent update (deleting and revalidating data) happens in the background.
  //
  // In this case, when the user confirms deletion, startTransition ensures the UI can show a loading state (isPending)
  // and prevents UI jank or blocking while the reservation is being deleted and the UI is updated.
  const [isPending, startTransition] = useTransition();


  //use useTransition when you are using server action in a component which is not a form.
  //it provides an isPending state that can be used to show a loading spinner or other UI while the transition is in progress.
  function handleDelete() {
    if (confirm("Are you sure you want to delete this reservation?"))
      startTransition(() => deleteReservation(bookingId));
  }
  return (
    <button
      onClick={handleDelete}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
    >
      {!isPending ? (
        <>
          <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span className="mt-1">Delete</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}{" "}
    </button>
  );
}

export default DeleteReservation;
