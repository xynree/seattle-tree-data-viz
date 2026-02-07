import { useMemo } from "react";

export default function FeaturePanel({
  title,
  subtitle,
  content,
  style = "title",
}: {
  title: string;
  subtitle?: string;
  content: React.ReactNode | string;
  style?: "title" | "content";
}) {
  const styleClass = useMemo(() => {
    if (style === "content") {
      return "text-lg whitespace-nowrap";
    }
    return "text-lg font-semibold";
  }, [style]);

  return (
    <div className="flex flex-col gap-1 w-full rounded-xl bg-gray-50 border border-gray-100 p-2 px-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{title}</span>
        <span className="text-sm font-semibold text-gray-800">{subtitle}</span>
      </div>
      <span className={styleClass}>{content}</span>
    </div>
  );
}
