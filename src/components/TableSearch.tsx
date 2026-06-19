"use client";

import Image from "next/image";

const TableSearch = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input") as HTMLInputElement;
    const value = input?.value ?? "";
    const params = new URLSearchParams(window.location.search);
    params.set("search", value);
    params.delete("page");
    window.location.href = `${window.location.pathname}?${params}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
      <button type="submit" className="flex items-center">
        <Image src="/search.png" alt="Search" width={14} height={14} />
      </button>
    </form>
  );
};

export default TableSearch;
