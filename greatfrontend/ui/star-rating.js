import { useState } from "react";

function Star({ filled }) {
  const filledClass = filled ? "star-icon-filled" : "";
  const starClass = `star-icon ${filledClass}`;
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={starClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </div>
  );
}

export default function StarRating({ max, value, onChange }) {
  const [hIndex, setHIndex] = useState(null);
  const starArray = new Array(max).fill(1);
  return (
    <div>
      {starArray.map((_, idx) => (
        <span
          key={idx}
          onMouseEnter={() => setHIndex(idx)}
          onMouseLeave={() => setHIndex(null)}
          onClick={() => onChange(idx + 1)}
        >
          <Star filled={hIndex !== null ? idx <= hIndex : idx < value} />
        </span>
      ))}
    </div>
  );
}


import StarRating from "./StarRating";
import { useState } from "react";

export default function App() {
  const [rating, setRating] = useState(null);
  return (
    <div className="row">
      <StarRating max={5} value={rating} onChange={setRating} />
    </div>
  );
}

/*
body {
  font-family: sans-serif;
}

.star-icon {
  --icon-size: 32px;

  cursor: pointer;
  height: var(--icon-size);
  width: var(--icon-size);
}

.star-icon-filled {
  fill: yellow;
}
*/