import React from "react";
import { useAuthStore } from "../../store/store";
import UsersForConnections from "../common/UsersForConnections";
import { useNavigate } from "react-router-dom";

const categories = [
  "Programming",
  "Data Science",
  "Technology",
  "Self Improvement",
  "Writing",
  "Relationships",
  "Machine Learning",
  "Coding",
  "Blockchain",
  "Artificial Intelligence",
  "ChatGPT",
  "30 Day Challenge",
  "Drawing",
  "Game Development",
  "Tech",
];

const Sidebar = () => {
  const { auth } = useAuthStore((state) => state);
  const navigate = useNavigate();

  return (
    <div className="position-sticky" style={{ top: "2rem" }}>
      {auth ? (
        <div className="p-4 bg-body-tertiary rounded">
          <h4 className="fst-italic">About</h4>
          <p className="mb-0">{auth?.bio}</p>
        </div>
      ) : null}

      <div className="p-4">
        <h4 className="fst-italic">Recommended topics</h4>
        <ol className="list-unstyled">
          {categories.map((category, key) => (
            <li
              className="badge rounded-pill text-bg-secondary p-2 m-1 cursor-pointer"
              key={key}
              onClick={() => navigate(`/?category=${category}`)}
            >
              {category}
            </li>
          ))}
        </ol>
      </div>

      {auth ? (
        <div className="p-4">
          <h4 className="fst-italic">Who to follow</h4>

          <div>
            <UsersForConnections />
          </div>
        </div>
      ) : null}

      <div className="p-4">
        <h4 className="fst-italic">Elsewhere</h4>
        <ol className="list-unstyled">
          <li>GitHub</li>
          <li>Twitter</li>
          <li>Facebook</li>
        </ol>
      </div>
    </div>
  );
};

export default Sidebar;
