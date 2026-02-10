import { useMemo, useState } from "react";
import { useWikipediaSummary } from "../../../hooks";

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
      <div className="relative bg-gray-800/10 rounded-3xl my-2 h-72 min-h-72 min-48">
        {galleryImages.length ? (
          <div className="h-72 rounded-3xl">
            <img
              src={galleryImages[index]?.srcset[0].src ?? ""}
              alt={
                galleryImages[index]?.caption?.text ??
                galleryImages[index]?.title
              }
              className="m-auto object-cover h-full w-full rounded-3xl"
            />

            {/* Controls */}
            <div className="absolute flex items-center bottom-0 bg-white/60 w-full justify-between ">
              <button
                className="disabled:text-gray-400 cursor-pointer p-3 text-green-800 material-symbols-outlined"
                onClick={() =>
                  setIndex((prev) =>
                    prev === 0 ? galleryImages.length - 1 : prev - 1,
                  )
                }
                disabled={index === 0}
              >
                arrow_left
              </button>

              {/* Caption */}
              {galleryImages[index]?.caption?.text && (
                <div className="text-xs px-2 py-1 max-h-12 text-ellipsis overflow-hidden">
                  {galleryImages[index]?.caption?.text}
                </div>
              )}

              <button
                className="cursor-pointer disabled:text-gray-400 p-2 text-green-800 hover:text-green-900 transition material-symbols-outlined"
                onClick={() =>
                  setIndex((prev) =>
                    prev === galleryImages.length - 1 ? 0 : prev + 1,
                  )
                }
                disabled={index === galleryImages.length - 1}
              >
                arrow_right
              </button>
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

      <h3 className="subtitle">About</h3>
      {summary?.extract_html ? (
        <div className="flex flex-col gap-1">
          <span
            className="text-sm h-max"
            dangerouslySetInnerHTML={{ __html: summary.extract_html }}
          />
          <span>
            <a
              className="text-blue-500 font-light w-min text-nowrap text-xs rounded-full"
              href={summary?.content_urls?.desktop.page ?? ""}
              target="_blank"
            >
              Wikipedia
            </a>
          </span>
        </div>
      ) : isLoading ? (
        <div className="h-48 w-full bg-gray-800/10 animate-pulse rounded-xl"></div>
      ) : (
        ""
      )}
      <span></span>
    </>
  );
}
