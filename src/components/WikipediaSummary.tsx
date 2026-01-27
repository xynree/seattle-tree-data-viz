import { useWikipediaSummary } from "../hooks";

export default function WikipediaSummary({
  scientificName,
}: {
  scientificName: string | null;
}) {
  const { imageUrl, isLoading, summary } = useWikipediaSummary(scientificName);

  return (
    <>
      <div className="bg-gray-200 rounded-lg my-2 h-48 min-48">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={scientificName ?? ""}
            className="w-full object-contain max-h-48"
          />
        ) : !isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-center m-auto text-gray-400 material-symbols-outlined text-2xl">
              hide_image
            </span>
          </div>
        ) : null}
      </div>
      {summary?.extract_html ? (
        <div
          className="text-sm mb-2"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          dangerouslySetInnerHTML={{ __html: summary.extract_html }}
        />
      ) : (
        ""
      )}
    </>
  );
}
