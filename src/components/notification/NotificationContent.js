import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { capitalizeString } from "../../helper/common";


const NotificationContent = ({ notification }) => {
  const navigate = useNavigate();

  const content = useMemo(() => {
    return notification.type === "like" ? (
      <span className="mx-2">
        <strong>
          <Link
            to={`/${notification?.created_by?.username}`}
            className="text-decoration-none text-dark"
          >
            {capitalizeString(notification?.created_by?.username)}
          </Link>
        </strong>
        <span className="mx-2">likes</span>
        <strong>
          <Link
            to={`/posts/${notification?.post?._id}`}
            className="text-decoration-none text-dark"
          >
            your post.
          </Link>
        </strong>
      </span>
    ) : notification.type === "follow" ? (
      <span className="mx-2">
        <strong>
          <Link
            to={`/${notification?.created_by?.username}`}
            className="text-decoration-none text-dark"
          >
            {capitalizeString(notification?.created_by?.username)}
          </Link>
        </strong>
        <span className="mx-2">started following you.</span>
      </span>
    ) : notification.type === "post" ? (
      <div>
        <span className="mx-2">
          <strong>
            <Link
              to={`/${notification?.created_by?.username}`}
              className="text-decoration-none text-dark"
            >
              {capitalizeString(notification?.created_by?.username)}
            </Link>
          </strong>{" "}
          <span>is created a post</span> {" "}
          <span className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/posts/${notification?.post?._id}`)}>
            {/* <EyeIcon style={{ width: "1.5rem", height: "1.5rem" }} /> */}
            View Post
          </span>
        </span>
      </div>
    ) : null;
  }, []);

  return content;
};

export default NotificationContent;
