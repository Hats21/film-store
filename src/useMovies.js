import { useState, useEffect } from "react";

const API_URL = "http://www.omdbapi.com";
const KEY = "f9d44a50";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // callback?.();

      const controller = new AbortController();

      const fetchMovies = async function () {
        try {
          setError("");
          setIsloading(true);
          const res = await fetch(`${API_URL}/?apikey=${KEY}&s=${query}`, {
            signal: controller.signal,
          });
          const data = await res.json();
          if (data.Response === "False") throw new Error(data.Error);
          if (!res.ok)
            throw new Error("Something went wrong with getting movies.");
          setMovies(data.Search);
          // setIsloading(false);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsloading(false);
        }
      };
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
