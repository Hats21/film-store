import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating color="blue" setMovieRating={setMovieRating} />
//       <p>The movie was rated {movieRating} stars</p>
//     </div>
//   );
// }

// import ExpandText from "./ExpandText";

const fullText =
  "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architectodolorum nobis cum. In soluta similique harum unde, doloribus nobis veroquisquam consectetur tempora minima rem perferendis facere, possimusitaque eligendi.";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
