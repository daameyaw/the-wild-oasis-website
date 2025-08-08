import React from "react";
import { auth } from "../_lib/auth";

export default async function page() {
  const { user } = await auth();
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome back, {user.name}
    </h2>
  );
}
