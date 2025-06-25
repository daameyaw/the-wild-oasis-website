"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function Filter() {
  // Recipe for getting data into the URL
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter) {
/* This code snippet is handling the filtering functionality in the Filter component. Here's a
breakdown of what it does: */
    /* `const params = new URLSearchParams(searchParams);` is creating a new instance of the
    URLSearchParams object using the `searchParams` variable. This allows you to work with the query
    parameters in the URL easily by providing methods to manipulate and access the parameters. In
    this specific context, it is used to update the 'capacity' parameter in the URL when a filter is
    selected in the Filter component. */
    const params = new URLSearchParams(searchParams);
    /* `params.set("capacity", filter);` is setting the value of the "capacity" parameter in the URL to
    the value of the `filter` variable. This line of code is updating the query parameter "capacity"
    in the URL with the selected filter value when a user interacts with the filtering functionality
    in the Filter component. */
    params.set("capacity", filter);
/* The code snippet `router.replace(`?${params.toString()}`, { scroll: false });` is
responsible for updating the URL in the browser with the new query parameters after a filter is
selected in the Filter component. */
    router.replace(`${pathName}?${params.toString()}`, {
      scroll: false,
    });
    // console.log(filter);
  }
  return (
    <div className="border border-primary-800 flex">
      <Button
        filter="all"
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        All Cabins
      </Button>
      <Button
        filter="small"
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        filter="medium"
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        4&mdash;7 guests
      </Button>
      <Button
        filter="large"
        activeFilter={activeFilter}
        handleFilter={handleFilter}
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        activeFilter === filter ? "bg-primary-700 text-primary-50" : ""
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}
