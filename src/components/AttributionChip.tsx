export default function AttributionChip() {
  return (
    <div className="text-sm flex items-center gap-2 bg-white shadow-sm absolute bottom-4 left-4 p-2 px-3 rounded-lg z-10">
      <p> Made by xynree</p>

      <div className="flex gap-2 text-gray-700">
        {/* Website */}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.xinrui.work"
          className="w-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
          >
            <path d="m332-264 148-113 148 113-56-182 148-106H538l-58-192-58 192H240l148 106-56 182ZM480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://instagram.com/xynree"
          className="ml-1 w-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 3.75H7.5a3.75 3.75 0 00-3.75 3.75v9a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75v-9a3.75 3.75 0 00-3.75-3.75z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.25 6.75a.75.75 0 100-0.0.75.75 0 000 1.5z"
            ></path>
          </svg>
        </a>

        {/* Github */}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/xynree"
          className="w-5"
        >
          <svg
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M56.7937 84.9688C44.4187 83.4688 35.7 74.5625 35.7 63.0313C35.7 58.3438 37.3875 53.2813 40.2 49.9063C38.9812 46.8125 39.1687 40.25 40.575 37.5313C44.325 37.0625 49.3875 39.0313 52.3875 41.75C55.95 40.625 59.7 40.0625 64.2937 40.0625C68.8875 40.0625 72.6375 40.625 76.0125 41.6563C78.9187 39.0313 84.075 37.0625 87.825 37.5313C89.1375 40.0625 89.325 46.625 88.1062 49.8125C91.1062 53.375 92.7 58.1563 92.7 63.0313C92.7 74.5625 83.9812 83.2813 71.4187 84.875C74.6062 86.9375 76.7625 91.4375 76.7625 96.5938L76.7625 106.344C76.7625 109.156 79.1062 110.75 81.9187 109.625C98.8875 103.156 112.2 86.1875 112.2 65.1875C112.2 38.6563 90.6375 17 64.1062 17C37.575 17 16.2 38.6562 16.2 65.1875C16.2 86 29.4187 103.25 47.2312 109.719C49.7625 110.656 52.2 108.969 52.2 106.438L52.2 98.9375C50.8875 99.5 49.2 99.875 47.7 99.875C41.5125 99.875 37.8562 96.5 35.2312 90.2188C34.2 87.6875 33.075 86.1875 30.9187 85.9063C29.7937 85.8125 29.4187 85.3438 29.4187 84.7813C29.4187 83.6563 31.2937 82.8125 33.1687 82.8125C35.8875 82.8125 38.2312 84.5 40.6687 87.9688C42.5437 90.6875 44.5125 91.9063 46.8562 91.9063C49.2 91.9063 50.7 91.0625 52.8562 88.9063C54.45 87.3125 55.6687 85.9063 56.7937 84.9688Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
