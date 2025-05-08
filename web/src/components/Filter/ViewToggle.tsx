"use client";
import * as React from "react";

interface ViewToggleProps {
  activeView: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  activeView,
  onViewChange,
}) => {
  return (
    <nav className="flex gap-2 items-center self-stretch my-auto">
      <button
        onClick={() => onViewChange("grid")}
        className={`flex overflow-hidden gap-2.5 justify-center items-center self-stretch px-1 my-auto w-6 h-6 rounded min-h-6 cursor-pointer ${
          activeView === "grid" ? "bg-[#F6F9FF] bg-opacity-10" : ""
        }`}
        aria-label="Grid view"
        aria-pressed={activeView === "grid"}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/26cbfc1adfc66e668012dfb47d6f34ed2ddae1f3?placeholderIfAbsent=true&apiKey=bcc16e0ebf784e789d20ef86aa2394c4"
          className="object-contain self-stretch my-auto w-3 aspect-square"
          alt="Grid view"
        />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`flex overflow-hidden gap-2.5 justify-center items-center self-stretch px-1 py-2 my-auto w-6 rounded min-h-6 cursor-pointer ${
          activeView === "list" ? "bg-[#F6F9FF] bg-opacity-10" : ""
        }`}
        aria-label="List view"
        aria-pressed={activeView === "list"}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c011d236bd6c3631f00d12538ab3ce97ab5b8da6?placeholderIfAbsent=true&apiKey=bcc16e0ebf784e789d20ef86aa2394c4"
          className="object-contain self-stretch my-auto w-3 aspect-[1.5]"
          alt="List view"
        />
      </button>
    </nav>
  );
};

export default ViewToggle;
