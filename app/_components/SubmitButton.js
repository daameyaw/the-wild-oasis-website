"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingLabel }) {
  // The useFormStatus hook is a React (or Next.js) hook that provides information about the current status of a form submission.
  // It allows you to access properties like 'pending', 'success', or 'error' to update the UI based on the form's state.
  //
  // Important: useFormStatus must be used inside a component that is a direct child (or descendant) of a <form> element.
  // This is because the hook relies on React's context system, which only provides form status to components within the form tree.
  //
  // If you try to use useFormStatus outside of a form, it will not work and will not provide any status updates.
  //
  // Typical use cases include disabling a submit button while the form is submitting, showing a loading spinner, or displaying success/error messages.
  //
  // Example usage:
  // function SubmitButton() {
  //   const { pending } = useFormStatus();
  //   return <button disabled={pending}>Submit</button>;
  // }
  //
  // This ensures the button is disabled while the form is being submitted, improving user experience.
  //   useFormStatus must be used inside a component that is a child of a <form>. It won’t work outside the form.

  const { pending } = useFormStatus();

  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
