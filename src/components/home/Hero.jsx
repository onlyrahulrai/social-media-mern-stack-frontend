import React from "react";
import categories from "../../assets/data/categories";

const Hero = () => {
  return (
    <div className="mb-4 rounded" id="hero">
      {/* <div className="col-md-6 px-0">
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
      </div> */}
      <div className="mt-5">
        <div className="rounded p-4 mx-auto">
          <div
            className="carousel m-0 d-flex"
            style={{ overflowX: "scroll" }}
            id="hero"
          >
            <div className="position-relative m-2">
              <div
                className="position-relative"
                style={{
                  width: "108px",
                  height: "108px",
                  borderRadius: "50%",
                  border: "2px solid #e84118",
                  padding: "1px",
                }}
              >
                <img
                  src="https://az779572.vo.msecnd.net/screens-400/d87fa5e74c9148fc8c6da800463f36c4"
                  alt="..."
                  className="img-fluid rounded-circle"
                />
                <span className="position-absolute top-0 start-78 translate-middle p-2 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">New alerts</span>
                </span>
              </div>
              <div className="m-2 text-small">Categories</div>
            </div>
            {categories.map((category, key) => (
              <div className="position-relative m-2" key={key}>
                <div
                  className="position-relative"
                  style={{
                    width: "108px",
                    height: "108px",
                    borderRadius: "50%",
                    border: "2px solid #e84118",
                    padding: "1px",
                  }}
                >
                  <img
                    src="https://nextbootstrap.netlify.app/assets/images/profiles/7.jpg"
                    alt="..."
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div className="m-2 text-small text-center">
                  {category.label.length > 9
                    ? `${category.label.substring(0, 9)}...`
                    : category.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
