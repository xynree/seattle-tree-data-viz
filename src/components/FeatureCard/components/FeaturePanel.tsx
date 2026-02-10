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
    return "text-lg font-semibold whitespace-nowrap";
  }, [style]);

  return (
    <div className="shrink-0 flex-1 flex flex-col gap-1 surface-100">
      <div className="flex justify-between items-center">
        <span className="subtitle">{title}</span>
        <span className="text-sm font-semibold text-gray-800">{subtitle}</span>
      </div>
      <span className={styleClass}>{content}</span>
    </div>
  );
}
