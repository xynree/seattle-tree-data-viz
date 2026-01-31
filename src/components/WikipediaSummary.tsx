import { useMemo, useState } from "react";
import { useWikipediaSummary } from "../hooks";

export default function WikipediaSummary({
  scientificName,
}: {
  scientificName: string | null;
}) {
  const { mediaList, isLoading, summary } = useWikipediaSummary(scientificName);
  const [index, setIndex] = useState(0);

  const galleryImages = useMemo(() => {
    return (
      mediaList?.filter(
        (media) =>
          media.showInGallery &&
          !media.title.includes("Status") &&
          !media.title.includes("range"),
      ) ?? []
    );
  }, [mediaList]);

  return (
    <>
      <div className="relative bg-gray-200 rounded-lg my-2 h-72 min-48">
        {galleryImages.length ? (
          <div className="h-72">
            <img
              src={galleryImages[index]?.srcset[0].src ?? ""}
              alt={
                galleryImages[index]?.caption?.text ??
                galleryImages[index]?.title
              }
              className="m-auto object-scale-down h-72"
            />

            {/* Caption */}
            {galleryImages[index]?.caption?.text && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/80 bg-opacity-50 text-black text-xs px-3 py-1">
                {galleryImages[index]?.caption?.text}
              </div>
            )}

            {/* Controls */}
            <div className="absolute top-2/5 p-2 flex w-full justify-between ">
              <span
                className="cursor-pointer p-2 text-green-800 rounded-full bg-white/60 hover:white/80 material-symbols-outlined"
                onClick={() =>
                  setIndex((prev) =>
                    prev === 0 ? galleryImages.length - 1 : prev - 1,
                  )
                }
              >
                arrow_left
              </span>
              <span
                className="cursor-pointer p-2 rounded-full bg-white/60 text-green-800 hover:bg-white/80 material-symbols-outlined"
                onClick={() =>
                  setIndex((prev) =>
                    prev === galleryImages.length - 1 ? 0 : prev + 1,
                  )
                }
              >
                arrow_right
              </span>
            </div>
          </div>
        ) : !isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-center m-auto text-gray-400 material-symbols-outlined text-2xl">
              hide_image
            </span>
          </div>
        ) : null}
      </div>

      {summary?.extract_html ? (
        <span
          className="text-sm h-max"
          dangerouslySetInnerHTML={{ __html: summary.extract_html }}
        />
      ) : (
        ""
      )}
      <span>
        <a
          className="text-blue-500 pl-2 my-1 w-min text-nowrap text-sm rounded-full"
          href={summary?.content_urls?.desktop.page ?? ""}
          target="_blank"
        >
          View more
        </a>
      </span>
    </>
  );
}
