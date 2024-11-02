import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import { useKeyState } from "./useKeyState";

document.title = "usePopcorn";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const API_URL = "http://www.omdbapi.com";
const KEY = "f9d44a50";
// App is a structural component
export default function App() {
  const searchKeyWords = [
    "back",
    "love",
    "action",
    "comedy",
    "adventure",
    "lost",
  ];

  const randomNumber = Math.round(Math.random() * searchKeyWords.length) - 1;

  const randomWord = searchKeyWords.at(randomNumber);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState({});

  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [query, setQuery] = useState(randomWord);

  const [userRating, setUserRating] = useState(0);

  // const [watched, setWatched] = useState([]);

  // in js we can call a function before it is declared
  // in this case handleCloseMovie
  // but in arrow function and function expression doesn't work
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorage([], "watched");

  function handleAddToWatched() {
    const { imdbID, Title, Year, Poster, Runtime, imdbRating } = selectedMovie;
    setWatched((arr) => [
      ...arr,
      {
        imdbID,
        Title,
        Year,
        Poster,
        Runtime: Number.parseInt(Runtime),
        imdbRating,
        userRating,
      },
    ]);

    setSelectedId(null);
    setUserRating(0);
  }

  function handleDeleteWatched(id) {
    setWatched((arr) => arr.filter((cur, i, ar) => cur.imdbID !== id));
  }

  // useEffect(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   setWatched(storedValue);
  // }, []);

  useEffect(
    function () {
      async function getMovieDetail() {
        if (!selectedId) return;
        setIsMovieLoading(true);
        const res = await fetch(`${API_URL}/?apikey=${KEY}&i=${selectedId}`);
        const data = await res.json();
        setSelectedMovie(data);
        setIsMovieLoading(false);
      }
      getMovieDetail();
    },
    [selectedId]
  );

  function handleCloseMovie() {
    setSelectedId(null);
  }

  // async function handleSearch(queryStr) {
  //   try {
  //     setIsloading(true);
  //     setError("");
  //     const res = await fetch(
  //       `http://www.omdbapi.com/?apikey=${KEY}&s=${queryStr}`
  //     );
  //     const data = await res.json();

  //     if (data.Response === "False") throw new Error(data.Error);
  //     if (!res.ok) throw new Error("Something went wrong with getting movies.");
  //     setMovies(data.Search);

  //     setIsloading(false);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setIsloading(false);
  //   }
  // }
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* <ListBox element={<MovieList movies={movies} />} />
        <ListBox
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}
        <ListBox>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </ListBox>
        <ListBox>
          {selectedId ? (
            isMovieLoading ? (
              <Loader />
            ) : (
              <SelectedMovie
                id={selectedId}
                handleCloseMovie={handleCloseMovie}
                selectedMovie={selectedMovie}
                userRating={userRating}
                setUserRating={setUserRating}
                handleAddToWatched={handleAddToWatched}
                watched={watched}
              />
            )
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">⛔ {message}</p>;
}
// NavBar is a structural component it is about a layout of the page
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
// it is a stateless component which is all about presentation
// it does not have any state it simply can recieve a props and display the returned JSX
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
// is a statefull componenet it has a state
function Search({ query, setQuery }) {
  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   el.focus();
  // }, []);

  // const inputEl = useRef(null);

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (document.activeElement === inputEl.current) return;
  //       if (e.key === "Enter") {
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     document.addEventListener("keydown", callback);
  //     console.log(inputEl.current);
  //     inputEl.current.focus();
  //   },
  //   [setQuery]
  // );

  const inputEl = useKeyState("Enter", setQuery);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // handleSearch(query);
        setQuery(query);
      }}
    >
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
      />
    </form>
  );
}
// a stateless component
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
// structural componenet
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function ListBox({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MovieList({ movies, selectedId, setSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, selectedId, setSelectedId }) {
  return (
    <li
      className={movie.imdbID === selectedId ? "active" : ""}
      onClick={() => {
        if (movie.imdbID === selectedId) return setSelectedId(null);
        setSelectedId(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SelectedMovie({
  id,
  handleCloseMovie,
  selectedMovie,
  userRating,
  setUserRating,
  handleAddToWatched,
  watched,
}) {
  const [top, setTop] = useState(userRating > 8);
  console.log(top);
  console.log(userRating);

  useEffect(
    function () {
      setTop(userRating > 8);
    },
    [userRating]
  );

  useEffect(
    function () {
      document.title = `Movie | ${selectedMovie.Title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [selectedMovie]
  );
  // useKeyState("Escape", handleCloseMovie);

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") handleCloseMovie();
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [handleCloseMovie]
  );

  const isWatched = watched
    .map((movie) => movie.imdbID)
    .includes(selectedMovie.imdbID);

  const userRatedValue = watched.find(
    (movie) => movie.imdbID === selectedMovie.imdbID
  )?.userRating;

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={handleCloseMovie}>
          ⬅
        </button>
        <img
          src={selectedMovie.Poster}
          alt={`Poster of ${selectedMovie.Title}`}
        />
        <div className="details-overview">
          <h2>{selectedMovie.Title}</h2>
          <p>
            {selectedMovie.Released} &bull; {selectedMovie.Runtime}
          </p>
          <p>{selectedMovie.Genre}</p>
          <p>
            <span>⭐</span>
            {selectedMovie.imdbRating} imdb Rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {isWatched ? (
            <p>You watched this movie! ⭐ {userRatedValue} ratings</p>
          ) : (
            <>
              <StarRating
                maxRating={10}
                size={24}
                setMovieRating={setUserRating}
              />
              {userRating !== 0 && (
                <button className="btn-add" onClick={handleAddToWatched}>
                  + add to list
                </button>
              )}
            </>
          )}
        </div>

        <p>
          <em>{selectedMovie.Plot}</em>
        </p>
        <p>Starring {selectedMovie.Actors}</p>
        <p>Directed by {selectedMovie.Director}</p>
      </section>
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(2);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.Runtime)).toFixed(2);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          handleDeleteWatched={handleDeleteWatched}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleDeleteWatched }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleDeleteWatched(movie.imdbID)}
        >
          &times;
        </button>
      </div>
    </li>
  );
}
