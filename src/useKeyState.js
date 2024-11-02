import { useRef, useEffect } from "react";

export function useKeyState(key, action) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === key) {
          inputEl.current.focus();
          action("");
        }
      }
      document.addEventListener("keydown", callback);
    },
    [action, key]
  );
  return inputEl;
}
