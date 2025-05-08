import * as React from "react";

interface FileTypeFilterProps {
  fileTypes: string[];
}

const FileTypeFilter: React.FC<FileTypeFilterProps> = ({ fileTypes }) => {
  return (
    <div className="flex flex-wrap gap-3 items-center mt-6 w-full text-xs font-medium text-zinc-600 max-md:max-w-full">
      {fileTypes.map((fileType, index) => (
        <button
          key={index}
          className="gap-2.5 self-stretch px-3 py-1.5 my-auto whitespace-nowrap rounded-md border border-solid border-[#D9D9D9] border-opacity-10"
        >
          {fileType}
        </button>
      ))}
    </div>
  );
};

export default FileTypeFilter;
