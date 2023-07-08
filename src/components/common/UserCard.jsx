import React from "react";
import Avatar from "../../assets/profile.png";
import { capitalizeString, getImageUrl } from "../../helper/common";

const UserCard = ({ user }) => {
  const { profile, username, firstName, lastName, email } = user;

  return (
    <div className="d-flex align-items-center">
      <img
        src={getImageUrl(profile) || Avatar}
        alt=""
        width={48}
        height={48}
        className="object-fit-contain rounded-full cursor-pointer"
      />
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
