import { useState } from "react";

export default function ExpandText({ text, lengthInitialText, firstExpanded }) {
  const [expanded, setExpanded] = useState(firstExpanded);

  return (
    <p>
      {expanded ? text : `${text.slice(0, lengthInitialText)}...`}
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show less" : "Show more"}
      </button>
    </p>
  );
}
