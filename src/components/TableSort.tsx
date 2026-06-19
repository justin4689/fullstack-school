"use client";

import Image from "next/image";

const TableSort = () => {
  const handleSort = () => {
    const params = new URLSearchParams(window.location.search);
    const current = params.get("sort");
    params.set("sort", !current || current === "desc" ? "asc" : "desc");
    params.delete("page");
    window.location.href = `${window.location.pathname}?${params}`;
  };

  return (
    <button
      onClick={handleSort}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
      title="Sort by name"
    >
      <Image src="/sort.png" alt="Sort" width={14} height={14} />
    </button>
  );
};

export default TableSort;
