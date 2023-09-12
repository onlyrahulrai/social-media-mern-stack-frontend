import React from "react";
import { capitalizeString } from "../../helper/common";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";

const UserCard = ({ user }) => {
  const { username, firstName, lastName, email } = user;
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center">
      <div onClick={() => navigate(`/${username}`)} className="cursor-pointer">
        <UserAvatar user={user} />
      </div>

      <div className="mx-3">
        <span>
          @{username} - {email}
        </span>{" "}
        <br />
        <span>
          {capitalizeString(firstName)} {capitalizeString(lastName)}
        </span>
      </div>
    </div>
  );
};

export default UserCard;
