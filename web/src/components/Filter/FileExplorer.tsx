"use client";
import * as React from "react";
import ViewToggle from "./ViewToggle.tsx";
import FileTypeFilter from "./FileTypeFilter.tsx";

const FileExplorer = ({activeView, setActiveView}) => {
  const handleViewChange = (view: "grid" | "list") => {
    setActiveView(view);
  };

  const fileTypes = [
    "Documents",
    "Photos",
    "Videos",
    "Compressed ZIPs",
    "Audio",
    "Select file type",
  ];

  return (
    <section className="max-w-[792px] mt-10 mb-6">
      <header className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
        <h2 className="self-stretch my-auto text-sm tracking-normal text-black font-[542]">
          All files
        </h2>
        <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
      </header>
      <FileTypeFilter fileTypes={fileTypes} />
    </section>
  );
};

export default FileExplorer;
