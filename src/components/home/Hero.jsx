import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="p-4 p-md-5 mb-4 rounded text-bg-dark">
      <div className="col-md-6 px-0">
        <h1 className="display-3 text-bold fst-italic">
          Title of a longer featured blog post
        </h1>
        <p className="lead my-3">
          Multiple lines of text that form the lede, informing new readers
          quickly and efficiently about what’s most interesting in this post’s
          contents.
        </p>
        <p className="lead mb-0">
          <Link to="/" className="text-white fw-bold">
            Continue reading...
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Hero;
