export default function FeaturePanel({
  title,
  subtitle,
  content,
}: {
  title: string;
  subtitle?: string;
  content: React.ReactNode | string;
}) {
  return (
    <div className="property-feature py-3!">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500">{title}</span>
        <span className="text-sm font-semibold text-gray-800">{subtitle}</span>
      </div>
      <span className="text-xl font-semibold">{content}</span>
    </div>
  );
}
