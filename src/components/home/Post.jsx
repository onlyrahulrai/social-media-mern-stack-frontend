import React, { useEffect, useMemo, useState } from "react";
import Banner from "../../assets/banner.jpg";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Avatar from "../../assets/profile.png";
import { getImageUrl, getLinesOfDescription } from "../../helper/common";

const Post = (props) => {
  const { _id: id, title, description, created_at, user, photo } = props;
  const { username, profile, firstName, lastName } = user;
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const getColorClass = useMemo(() => {
    const colors = [
      "primary",
      "secondary",
      "success",
      "danger",
      "warning",
      "info",
      "light",
      "dark",
    ];
    const index = Math.floor(Math.random() * 5);
    return colors[index];
  }, []);

  useEffect(() => {
    const texts = getLinesOfDescription(description);
    if (texts.length > 0) {
      setContent(texts[0]);
    }
  }, []);

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={` ${process.env.REACT_APP_BASE_URL}/uploads/${photo}`}
            className="img-fluid rounded-start"
            alt="..."
            style={{ height: "100%" }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <img
                src={getImageUrl(profile) || Avatar}
                alt=""
                width={42}
                height={42}
                className="object-fit-contain rounded-full cursor-pointer"
                onClick={() => navigate(`/${username}`)}
              />
              <div className="mx-2">
                <span>@{username}</span>
                <br />
                <span>
                  {firstName} {lastName}
                </span>
              </div>
            </div>

            <div className="my-2">
              <h3 className="card-title">{title}</h3>
              <p className="card-text">
                {content ? `${content.trim().substring(0, 128)}..` : null}
              </p>
              <p className="card-text">
                <span className={`badge rounded-pill text-bg-${getColorClass}`}>
                  World
                </span>{" "}
                <small className="text-body-secondary">
                  {moment(created_at).fromNow()}
                </small>
              </p>
            </div>
            <span
              onClick={() => navigate(`/posts/${id}`)}
              className="cursor-pointer text-primary text-decoration-underline"
            >
              Continue reading
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
