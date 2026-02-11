import type { Dispatch, SetStateAction } from "react";

export function SelectionButton({
  title,
  onClick,
  selected,
}: {
  title: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      className={`cursor-pointer p-2 hover:bg-white/50 w-full rounded-xl subtitle transition-all duration-300 ease-in-out ${selected ? "bg-white/70 text-gray-800" : "bg-white/0 "}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default function SelectionButtonGroup({
  sidebarSelection,
  setSidebarSelection,
}: {
  sidebarSelection: "filter" | "list" | "agg";
  setSidebarSelection: Dispatch<SetStateAction<"filter" | "list" | "agg">>;
}) {
  return (
    <div className="flex gap-4 p-2 px-6 text-sm">
      <SelectionButton
        title="View"
        onClick={() => setSidebarSelection("filter")}
        selected={sidebarSelection === "filter"}
      />
      <SelectionButton
        title="Stats"
        onClick={() => setSidebarSelection("agg")}
        selected={sidebarSelection === "agg"}
      />
      <SelectionButton
        title="List"
        onClick={() => setSidebarSelection("list")}
        selected={sidebarSelection === "list"}
      />
    </div>
  );
}
